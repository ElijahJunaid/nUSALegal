import { OpenAI } from 'openai'
import { tavily } from '@tavily/core'
import { validateQuery, type FilterResult } from '../utils/filter'
import { apiRateLimiter } from '../utils/rateLimit'
import { detectConversational } from '../utils/conversational-detector'

const THREAD_ID_PATTERN = /^thread_[a-zA-Z0-9]{24,}$/
const VECTOR_STORE_ID_PATTERN = /^vs_[a-zA-Z0-9]{24,}$/

function removeCitations(text: string): string {

  return text
    .replace(/【\d+:\d+†[^】]+】/g, '')
    .replace(/\[\d+:\d+†[^\]]+\]/g, '')
    .trim()
}

function sanitizeInput(input: string): string {
  if (!input) return ''
  return input
    .trim()
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

async function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  errorMessage?: string
): Promise<T> {
  let timeout: NodeJS.Timeout
  const timeoutPromise = new Promise<never>((_, reject) => {
    timeout = setTimeout(() => {
      reject(new Error(errorMessage || `Operation timed out after ${timeoutMs}ms`))
    }, timeoutMs)
  })

  try {
    return await Promise.race([promise, timeoutPromise])
  } finally {
    clearTimeout(timeout!)
  }
}

export default defineEventHandler(async (event) => {
  
  const rateLimit = await apiRateLimiter.check(event)
  if (!rateLimit.allowed) {
    throw createError({
      statusCode: 429,
      statusMessage: 'Too Many Requests',
      message: rateLimit.message,
      data: {
        retryAfter: rateLimit.retryAfter,
        limit: rateLimit.limit,
        remaining: rateLimit.remaining,
        reset: rateLimit.resetTime
      }
    })
  }

  const body = await readBody(event)
  
  const query = sanitizeInput(body.query || '')
  let thread_id = body.thread_id

  if (thread_id && !THREAD_ID_PATTERN.test(thread_id)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      message: 'Invalid thread_id format'
    })
  }

  const filterResult = validateQuery(query, 'chatbot-user')
  
  if (!filterResult.allowed) {
    return {
      thread_id,
      response: filterResult.suggestion || 'This question is not appropriate or relevant. Please ask something related to legal matters.',
      filterInfo: {
        severity: filterResult.severity,
        intent: filterResult.intent,
        confidence: filterResult.confidence
      }
    }
  }

  const conversationalResult = detectConversational(query)
  
  // Only block very basic one-word responses, let everything else go to the AI
  if (conversationalResult.isConversational && 
      conversationalResult.confidence > 0.9 && 
      query.trim().split(/\s+/).length <= 2 &&
      ['greeting', 'farewell', 'gratitude'].includes(conversationalResult.intent)) {
    console.log('[Chatbot] Basic conversational query detected:', {
      query: query.substring(0, 50),
      intent: conversationalResult.intent,
      confidence: conversationalResult.confidence
    })
    
    return {
      thread_id,
      response: conversationalResult.suggestedResponse || 
        "I'm here to help with legal questions! What would you like to know?"
    }
  }

  if (filterResult.severity === 'warn') {
    console.warn('[Chatbot] Borderline query allowed:', {
      query: query.substring(0, 50),
      score: filterResult.score,
      intent: filterResult.intent
    })
  }

  const config = useRuntimeConfig()
  const OPENAI_API_KEY = config.openaiApiKey
  const TAVILY_API_KEY = config.tavilyApiKey
  const VECTOR_STORE_ID = config.vectorStoreId
  const ASSISTANT_ID = config.assistantId

  if (!OPENAI_API_KEY || !TAVILY_API_KEY || !VECTOR_STORE_ID || !ASSISTANT_ID) {
    console.error('[Chatbot] Missing required environment variables')
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      message: 'Missing required environment variables'
    })
  }

  if (!VECTOR_STORE_ID_PATTERN.test(VECTOR_STORE_ID)) {
    console.error('[Chatbot] Invalid vectorStoreId format')
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      message: 'Invalid configuration'
    })
  }

  const openai = new OpenAI({
    apiKey: OPENAI_API_KEY,
    maxRetries: 3,
    timeout: 30000
  })

  const tavilyClient = tavily({ apiKey: TAVILY_API_KEY })

  async function tavilySearch(q: string): Promise<string> {
    try {
      const response = await tavilyClient.search(q)

      if (response.answer) return response.answer

      const results = response.results || []
      if (results.length > 0) {
        return results.map((r: any) => `${r.title}: ${r.url}`).join('\n')
      }

      return 'No relevant results found on the web.'
    } catch (error: any) {
      console.error('[Chatbot] Error performing Tavily search:', error.message)
      return `Error performing Tavily search: ${error.message}`
    }
  }

  try {
    
    if (!thread_id) {
      const thread = await openai.beta.threads.create()
      thread_id = thread.id
    }

    await openai.beta.threads.messages.create(thread_id, {
      role: 'user',
      content: query
    })

    let run = await withTimeout(
      openai.beta.threads.runs.createAndPoll(thread_id, {
        assistant_id: ASSISTANT_ID
      }),
      45000,
      'OpenAI API request timed out'
    )

    const activeThreadId = run.thread_id

    if (run.required_action?.type === 'submit_tool_outputs') {
      const tool_outputs = await Promise.all(
        run.required_action.submit_tool_outputs.tool_calls.map(async (action: any) => {
          const functionName = action.function.name
          const args = JSON.parse(action.function.arguments)

          let result: string
          if (functionName === 'tavily_search') {
            result = await tavilySearch(args.query || '')
          } else {
            result = 'Unknown tool requested.'
          }

          return {
            tool_call_id: action.id,
            output: result
          }
        })
      )

      run = await withTimeout(
        openai.beta.threads.runs.submitToolOutputsAndPoll(
          activeThreadId,
          run.id,
          { tool_outputs }
        ),
        45000,
        'OpenAI API request timed out'
      )
    }

    const messagesResponse = await openai.beta.threads.messages.list(activeThreadId)
    const assistantMessages = messagesResponse.data.filter((m) => m.role === 'assistant')

    if (assistantMessages.length === 0) {
      console.error('[Chatbot] No response from assistant')
      throw createError({
        statusCode: 500,
        statusMessage: 'Internal Server Error',
        message: 'No response from assistant'
      })
    }

    let assistantResponse = (assistantMessages[0].content[0] as any).text.value
    assistantResponse = removeCitations(assistantResponse)

    return {
      thread_id: activeThreadId,
      response: assistantResponse
    }
  } catch (error: any) {
    console.error('[Chatbot] Unhandled error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      message: error.message || 'An unexpected error occurred'
    })
  }
})
