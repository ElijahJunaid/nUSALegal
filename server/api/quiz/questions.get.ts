import { defineEventHandler, getQuery, createError } from 'h3'
import { dLog, dError } from '../../utils/debug'
import {
  getQuestionById,
  getQuestionsByCategory,
  getQuestionsByDifficulty,
  getRandomQuestions
} from '../../data/quiz-questions'
import crypto from 'crypto'

export default defineEventHandler(async event => {
  dLog('🔍 [QUIZ] Questions API called')

  try {
    // Quiz API uses sessionToken validation, not API access validation
    dLog('🔐 [QUIZ] Validating session token...')

    const query = getQuery(event)
    const questionId = query.id as string
    const category = query.category as string
    const difficulty = query.difficulty as string
    const count = parseInt(query.count as string) || 10
    const sessionToken = query.sessionToken as string

    // Validate session token
    if (!sessionToken || !isValidSessionToken(sessionToken)) {
      dError('❌ [QUIZ] Invalid session token')
      throw createError({
        status: 401,
        statusText: 'Invalid session token'
      })
    }

    let questions: QuizQuestion[] = []

    if (questionId) {
      const question = getQuestionById(parseInt(questionId))
      if (!question) {
        dError('❌ [QUIZ] Question not found:', questionId)
        throw createError({
          status: 404,
          statusText: 'Question not found'
        })
      }

      // Apply security transformations
      questions = [transformQuestionForClient(question, sessionToken)]
      dLog('📊 [QUIZ] Returning single question:', questionId)
    } else if (category) {
      const categoryQuestions = getQuestionsByCategory(category)
      questions = categoryQuestions
        .slice(0, count)
        .map(q => transformQuestionForClient(q, sessionToken))
      dLog('📊 [QUIZ] Returning', questions.length, 'questions for category:', category)
    } else if (difficulty) {
      const difficultyQuestions = getQuestionsByDifficulty(difficulty)
      questions = difficultyQuestions
        .slice(0, count)
        .map(q => transformQuestionForClient(q, sessionToken))
      dLog('📊 [QUIZ] Returning', questions.length, 'questions for difficulty:', difficulty)
    } else {
      const randomQuestions = getRandomQuestions(Math.min(count, 100))
      questions = randomQuestions.map(q => transformQuestionForClient(q, sessionToken))
      dLog('📊 [QUIZ] Returning', questions.length, 'random questions')
    }

    // Add security headers
    event.node.res.setHeader('X-Content-Type-Options', 'nosniff')
    event.node.res.setHeader('X-Frame-Options', 'DENY')
    event.node.res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')

    return {
      success: true,
      questions,
      sessionToken: generateNewSessionToken(sessionToken),
      timestamp: Date.now()
    }
  } catch (error: unknown) {
    dError('❌ [QUIZ] Questions API failed:', error)
    throw error
  }
})

interface QuizQuestion {
  id: number
  type: string
  text: string
  options?: string[]
  difficulty: string
  category: string
  hints?: string[]
  timeBomb?: boolean
  moveButton?: boolean
  fourthWall?: boolean
  _questionId?: number // For client-side deobfuscation
}

function isValidSessionToken(token: string): boolean {
  try {
    const [timestamp, hash] = token.split(':')
    const timeDiff = Date.now() - parseInt(timestamp)

    // Token expires after 1 hour
    if (timeDiff > 3600000) {
      return false
    }

    // Allow initial tokens for first request
    if (hash === 'initial') {
      return true
    }

    // Verify hash
    const expectedHash = crypto
      .createHash('sha256')
      .update(`${timestamp}:${process.env.QUIZ_SECRET || 'default-secret'}`)
      .digest('hex')

    return hash === expectedHash
  } catch {
    return false
  }
}

function generateNewSessionToken(oldToken: string): string {
  try {
    const timestamp = Date.now().toString()
    const hash = crypto
      .createHash('sha256')
      .update(`${timestamp}:${process.env.QUIZ_SECRET || 'default-secret'}`)
      .digest('hex')

    return `${timestamp}:${hash}`
  } catch {
    return oldToken
  }
}

function transformQuestionForClient(question: QuizQuestion, sessionToken: string): QuizQuestion {
  // Remove sensitive information
  const transformed = {
    id: question.id,
    type: question.type,
    text: obfuscateText(question.text, question.id, sessionToken),
    options: question.options
      ? question.options.map(opt => obfuscateText(opt, question.id, sessionToken))
      : undefined,
    difficulty: question.difficulty,
    category: question.category,
    hints: question.hints
      ? question.hints.map(h => obfuscateText(h, question.id, sessionToken))
      : undefined,
    timeBomb: question.timeBomb,
    moveButton: question.moveButton,
    fourthWall: question.fourthWall,
    // Include the original question ID for deobfuscation
    _questionId: question.id
  }

  return transformed
}

function obfuscateText(text: string, questionId: number, sessionToken: string): string {
  // Simple obfuscation to prevent easy extraction
  const seed = questionId + sessionToken.charCodeAt(0)
  return text
    .split('')
    .map((char, index) => {
      const code = char.charCodeAt(0)
      const obfuscated = code ^ ((seed + index) % 256)
      return String.fromCharCode(obfuscated)
    })
    .join('')
}
