import { defineEventHandler, readBody, createError } from 'h3'
import { validateApiAccess } from '../../utils/validateApiAccess'
import { dLog, dError } from '../../utils/debug'
import { getQuestionById, checkSecretCode } from '../../data/quiz-questions'
import crypto from 'crypto'

interface QuizRequestBody {
  questionId: number
  answer: string
  sessionToken: string
  timeSpent?: number
  skipUsed?: boolean
}

export default defineEventHandler(async event => {
  dLog('🔍 [QUIZ] Answer validation API called')

  try {
    dLog('🔐 [QUIZ] Validating API access...')
    validateApiAccess(event, 'quiz/validate-answer')
    dLog('✅ [QUIZ] API access validated')

    const body = (await readBody(event)) as QuizRequestBody
    const { questionId, answer, sessionToken, timeSpent, skipUsed } = body

    // Validate session token
    if (!sessionToken || !isValidSessionToken(sessionToken)) {
      dError('❌ [QUIZ] Invalid session token')
      throw createError({
        status: 401,
        statusText: 'Invalid session token'
      })
    }

    // Validate required fields
    if (!questionId || answer === undefined) {
      dError('❌ [QUIZ] Missing required fields')
      throw createError({
        status: 400,
        statusText: 'Missing required fields'
      })
    }

    const question = getQuestionById(parseInt(questionId.toString()))
    if (!question) {
      dError('❌ [QUIZ] Question not found:', questionId)
      throw createError({
        status: 404,
        statusText: 'Question not found'
      })
    }

    // Check for secret codes
    const secretQuestion = checkSecretCode(answer.toString().toUpperCase())
    if (secretQuestion) {
      dLog(' [QUIZ] Secret code discovered:', answer)
      return {
        success: true,
        correct: true,
        secret: true,
        secretQuestion: {
          id: secretQuestion.id,
          type: secretQuestion.type,
          text: deobfuscateText(secretQuestion.text, secretQuestion.id, sessionToken),
          options: secretQuestion.options
            ? secretQuestion.options.map(opt =>
                deobfuscateText(opt, secretQuestion.id, sessionToken)
              )
            : undefined,
          difficulty: secretQuestion.difficulty,
          category: secretQuestion.category,
          hints: secretQuestion.hints
            ? secretQuestion.hints.map(h => deobfuscateText(h, secretQuestion.id, sessionToken))
            : undefined
        },
        sessionToken: generateNewSessionToken(sessionToken),
        timestamp: Date.now()
      }
    }

    // Validate answer (case-insensitive for text input, trick questions, and multiple-choice)
    const normalizedAnswer =
      question.type === 'text-input' ||
      question.type === 'trick' ||
      question.type === 'multiple-choice'
        ? answer.toString().toLowerCase().trim()
        : answer.toString()
    const normalizedCorrectAnswer = question.answer.toLowerCase().trim()
    const isCorrect = normalizedAnswer === normalizedCorrectAnswer

    dLog(`🔍 [QUIZ] Answer comparison for question ${questionId}:`)
    dLog(`🔍 [QUIZ] Raw answer: "${answer}"`)
    dLog(`🔍 [QUIZ] Normalized answer: "${normalizedAnswer}"`)
    dLog(`🔍 [QUIZ] Correct answer: "${question.answer}"`)
    dLog(`🔍 [QUIZ] Normalized correct answer: "${normalizedCorrectAnswer}"`)
    dLog(`🔍 [QUIZ] Is correct: ${isCorrect}`)
    dLog(`🔍 [QUIZ] Question type: "${question.type}"`)

    // Check for time bomb questions
    if (question.timeBomb && timeSpent && timeSpent > 10000) {
      dLog('💣 [QUIZ] Time bomb exploded for question:', questionId)
      return {
        success: true,
        correct: false,
        timeBombExploded: true,
        message: "Time's up! The bomb exploded.",
        sessionToken: generateNewSessionToken(sessionToken),
        timestamp: Date.now()
      }
    }

    // Log answer attempt for analytics
    dLog(
      `📝 [QUIZ] Answer submitted for question ${questionId}: ${isCorrect ? 'CORRECT' : 'INCORRECT'}`
    )

    // Add security headers
    event.node.res.setHeader('X-Content-Type-Options', 'nosniff')
    event.node.res.setHeader('X-Frame-Options', 'DENY')
    event.node.res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')

    return {
      success: true,
      correct: isCorrect,
      questionId: parseInt(questionId.toString()),
      sessionToken: generateNewSessionToken(sessionToken),
      timestamp: Date.now(),
      analytics: {
        timeSpent,
        skipUsed,
        difficulty: question.difficulty,
        category: question.category
      }
    }
  } catch (error: unknown) {
    dError('❌ [QUIZ] Answer validation API failed:', error)
    throw error
  }
})

function isValidSessionToken(token: string): boolean {
  try {
    const [timestamp, hash] = token.split(':')
    const timeDiff = Date.now() - parseInt(timestamp)

    // Token expires after 1 hour
    if (timeDiff > 3600000) {
      return false
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

function deobfuscateText(text: string, questionId: number, sessionToken: string): string {
  // Reverse the obfuscation applied in questions API
  const seed = questionId + sessionToken.charCodeAt(0)
  return text
    .split('')
    .map((char, index) => {
      const code = char.charCodeAt(0)
      const deobfuscated = code ^ ((seed + index) % 256)
      return String.fromCharCode(deobfuscated)
    })
    .join('')
}
