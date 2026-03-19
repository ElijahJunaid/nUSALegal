import { OpenAI } from 'openai'
import { defineEventHandler, createError } from 'h3'
import { useRuntimeConfig } from '#imports'

const THREAD_ID_PATTERN = /^thread_[a-zA-Z0-9]{24,}$/

const handler = defineEventHandler(async event => {
  const reqUrl = event.node.req.url || ''
  const params = new URLSearchParams(reqUrl.split('?')[1] || '')
  const threadId = params.get('thread_id') || undefined

  if (!threadId) {
    throw createError({ status: 400, message: 'thread_id is required' })
  }

  if (!THREAD_ID_PATTERN.test(threadId)) {
    throw createError({ status: 400, message: 'Invalid thread_id format' })
  }

  const config = useRuntimeConfig()
  const OPENAI_API_KEY = config.openaiApiKey as string

  if (!OPENAI_API_KEY) {
    throw createError({ status: 500, message: 'Missing API key' })
  }

  const openai = new OpenAI({ apiKey: OPENAI_API_KEY })

  try {
    const messagesResponse = await openai.beta.threads.messages.list(threadId, {
      order: 'asc',
      limit: 100
    })

    const messages = messagesResponse.data.map(msg => {
      const textContent = msg.content.find(c => c.type === 'text')
      const text = textContent?.type === 'text' ? textContent.text.value : ''

      return {
        text,
        type: msg.role === 'assistant' ? 'bot' : 'user',
        isMarkdown: msg.role === 'assistant',
        timestamp: msg.created_at * 1000
      }
    })

    return { thread_id: threadId, messages }
  } catch (error: unknown) {
    console.error('[Chatbot] Error fetching thread history:', error)

    if (error instanceof OpenAI.APIError && error.status === 404) {
      return { thread_id: null, messages: [] }
    }

    throw createError({
      status: 500,
      message: 'Failed to fetch chat history'
    })
  }
})

// Mark as already wrapped to prevent Nitro double-wrapping warning
;(handler as unknown as Record<string, unknown>).__is_handler__ = true

export default handler
