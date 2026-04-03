import { defineEventHandler, readBody, createError, getQuery, H3Event } from 'h3'
import { validateApiAccess } from '../../utils/validateApiAccess'
import { dLog, dError } from '../../utils/debug'
import { secretManager } from '../../utils/secret-manager'
import {
  getQuestionById,
  getQuestionsByCategory,
  getQuestionsByDifficulty,
  getRandomQuestions,
  checkSecretCode
} from '../../data/quiz-questions'
import crypto from 'crypto'

interface QuizQuestion {
  id: number
  type: string
  text: string
  options?: string[]
  answer: string
  difficulty: string
  category: string
  hints?: string[]
  timeBomb?: boolean
  moveButton?: boolean
  fourthWall?: boolean
  secretCode?: string
  requiresPreviousAnswers?: number[]
  changesBasedOnAnswers?: boolean
}

interface QuizRequestBody {
  questionId?: number
  answer?: string
  sessionToken: string
  timeSpent?: number
  skipUsed?: boolean
  checksum?: string
  timestamp?: number
  secretCode?: string
  skipQuestion?: boolean
  fuseBombCheck?: boolean
}

interface QuizQuestionsRequest {
  sessionToken: string
  category?: string
  difficulty?: string
  count?: number
  checksum?: string
  timestamp?: number
}

export default defineEventHandler(async event => {
  dLog('🔍 [QUIZ-SECURE] Enhanced quiz API called')

  try {
    dLog('🔐 [QUIZ-SECURE] Validating API access...')
    validateApiAccess(event, 'quiz/secure')
    dLog('✅ [QUIZ-SECURE] API access validated')

    const method = event.node.req.method
    const clientIP = getClientIP(event)

    // Rate limiting check
    const identifier = event.node.req.headers['user-agent'] || 'unknown'
    if (!secretManager.checkRateLimit(identifier, clientIP)) {
      dError('❌ [QUIZ-SECURE] Rate limit exceeded')
      throw createError({
        status: 429,
        statusText: 'Too many requests'
      })
    }

    if (method === 'GET') {
      return handleQuestionsRequest(event, clientIP)
    } else if (method === 'POST') {
      return handleAnswerValidation(event, clientIP)
    } else {
      throw createError({
        status: 405,
        statusText: 'Method not allowed'
      })
    }
  } catch (error: unknown) {
    dError('❌ [QUIZ-SECURE] API failed:', error)
    throw error
  }
})

async function handleQuestionsRequest(event: H3Event, _clientIP: string) {
  const query = getQuery(event) as QuizQuestionsRequest
  const {
    sessionToken,
    category,
    difficulty,
    count = 10,
    checksum: _checksum,
    timestamp: _timestamp
  } = query

  // Validate session token
  if (!sessionToken || !isValidSessionToken(sessionToken)) {
    dError('❌ [QUIZ-SECURE] Invalid session token')
    throw createError({
      status: 401,
      statusText: 'Invalid session token'
    })
  }

  // Validate request integrity
  const bodyForValidation = { category, difficulty, count, timestamp: _timestamp }
  if (
    !secretManager.validateRequestIntegrity(bodyForValidation, event.node.req.headers, sessionToken)
  ) {
    dError('❌ [QUIZ-SECURE] Request integrity validation failed')
    throw createError({
      status: 400,
      statusText: 'Request integrity validation failed'
    })
  }

  // Get, filter and transform questions for client
  const transformedQuestions = secretManager
    .filterQuestionsBasedOnProgress(
      category
        ? getQuestionsByCategory(category).slice(0, Math.min(count, 100))
        : difficulty
          ? getQuestionsByDifficulty(difficulty).slice(0, Math.min(count, 100))
          : getRandomQuestions(Math.min(count, 100)),
      sessionToken
    )
    .map(q => transformQuestionForClient(q, sessionToken))

  // Add checksum for response integrity
  const responseData = {
    success: true,
    questions: transformedQuestions,
    sessionToken: generateNewSessionToken(sessionToken),
    timestamp: Date.now()
  }

  const responseChecksum = secretManager.generateChecksum(responseData, sessionToken)

  // Add security headers
  event.node.res.setHeader('X-Content-Type-Options', 'nosniff')
  event.node.res.setHeader('X-Frame-Options', 'DENY')
  event.node.res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
  event.node.res.setHeader('X-Quiz-Checksum', responseChecksum)

  return responseData
}

async function handleAnswerValidation(event: H3Event, _clientIP: string) {
  const body = (await readBody(event)) as QuizRequestBody
  const {
    questionId,
    answer,
    sessionToken,
    timeSpent,
    skipUsed,
    checksum: _checksum,
    timestamp: _timestamp,
    secretCode,
    skipQuestion,
    fuseBombCheck
  } = body

  // Validate session token
  if (!sessionToken || !isValidSessionToken(sessionToken)) {
    dError('❌ [QUIZ-SECURE] Invalid session token')
    throw createError({
      status: 401,
      statusText: 'Invalid session token'
    })
  }

  // Validate request integrity
  if (
    !secretManager.validateRequestIntegrity(
      body as unknown as Record<string, unknown>,
      event.node.req.headers,
      sessionToken
    )
  ) {
    dError('❌ [QUIZ-SECURE] Request integrity validation failed')
    throw createError({
      status: 400,
      statusText: 'Request integrity validation failed'
    })
  }

  // Get session state
  const sessionState =
    secretManager.getSessionState(sessionToken) ||
    secretManager.initializeSessionState(sessionToken)

  // Handle skip request
  if (skipQuestion && questionId) {
    const skipResult = secretManager.skipQuestion(sessionToken, questionId)
    const sessionStateUpdated =
      secretManager.getSessionState(sessionToken) ||
      secretManager.initializeSessionState(sessionToken)
    return {
      success: true,
      skipped: true,
      skipsRemaining: sessionStateUpdated.skipsRemaining,
      skippedQuestions: skipResult.skippedQuestions,
      sessionToken: generateNewSessionToken(sessionToken),
      timestamp: Date.now()
    }
  }

  // Handle fuse bomb check
  if (fuseBombCheck) {
    const bombStatus = secretManager.checkFuseBombStatus(sessionToken)
    return {
      success: true,
      fuseBombStatus: bombStatus,
      sessionToken: generateNewSessionToken(sessionToken),
      timestamp: Date.now()
    }
  }

  // Handle secret code validation
  if (secretCode) {
    try {
      const secretContent = await secretManager.loadSecretContent(
        parseInt(secretCode),
        sessionToken
      )

      dLog(`🎉 [QUIZ-SECURE] Secret code discovered: ${secretCode}`)

      return {
        success: true,
        secret: true,
        secretContent,
        sessionToken: generateNewSessionToken(sessionToken),
        timestamp: Date.now(),
        checksum: secretManager.generateChecksum({ secret: true, secretContent }, sessionToken)
      }
    } catch (error) {
      dError('❌ [QUIZ-SECURE] Secret code validation failed:', error)
      // Continue to normal answer validation
    }
  }

  // Validate required fields for normal answers
  if (!questionId || answer === undefined) {
    dError('❌ [QUIZ-SECURE] Missing required fields')
    throw createError({
      status: 400,
      statusText: 'Missing required fields'
    })
  }

  const question = getQuestionById(parseInt(questionId.toString()))
  if (!question) {
    dError('❌ [QUIZ-SECURE] Question not found:', questionId)
    throw createError({
      status: 404,
      statusText: 'Question not found'
    })
  }

  // Check for secret codes in answers
  const secretQuestion = checkSecretCode(answer.toString().toUpperCase())
  if (secretQuestion) {
    dLog('🎮 [QUIZ-SECURE] Secret code discovered in answer:', answer)

    try {
      const secretContent = await secretManager.loadSecretContent(secretQuestion.id, sessionToken)

      return {
        success: true,
        correct: true,
        secret: true,
        secretQuestion: transformQuestionForClient(secretQuestion, sessionToken),
        secretContent,
        sessionToken: generateNewSessionToken(sessionToken),
        timestamp: Date.now()
      }
    } catch (error) {
      dError('❌ [QUIZ-SECURE] Failed to load secret content:', error)
    }
  }

  // Validate answer
  const normalizedAnswer =
    question.type === 'text-input' ? answer.toString().toLowerCase().trim() : answer.toString()
  const normalizedCorrectAnswer = question.answer.toLowerCase().trim()
  const isCorrect = normalizedAnswer === normalizedCorrectAnswer

  // Update session state
  if (isCorrect) {
    sessionState.completedQuestions.push(questionId)
  } else {
    sessionState.failedAttempts[questionId] = (sessionState.failedAttempts[questionId] || 0) + 1
  }
  sessionState.lastActivity = Date.now()
  secretManager.setSessionState(sessionToken, sessionState)

  // Check for time bomb questions and activate fuse bomb
  if (question.timeBomb) {
    const bombActivation = secretManager.activateFuseBomb(sessionToken, 10000) // 10 seconds for time bombs
    dLog(
      `💣 [QUIZ-SECURE] Fuse bomb activated for question ${questionId}: ${bombActivation.duration}ms`
    )
  }

  // Check for time bomb questions
  if (question.timeBomb && timeSpent && timeSpent > 10000) {
    dLog('💣 [QUIZ-SECURE] Time bomb exploded for question:', questionId)
    return {
      success: true,
      correct: false,
      timeBombExploded: true,
      message: "Time's up! The bomb exploded.",
      sessionToken: generateNewSessionToken(sessionToken),
      timestamp: Date.now()
    }
  }

  // Log answer attempt
  dLog(
    `📝 [QUIZ-SECURE] Answer submitted for question ${questionId}: ${isCorrect ? 'CORRECT' : 'INCORRECT'}`
  )

  // Prepare response
  const responseData = {
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

  // Add checksum for response integrity
  const responseChecksum = secretManager.generateChecksum(responseData, sessionToken)

  // Add security headers
  event.node.res.setHeader('X-Content-Type-Options', 'nosniff')
  event.node.res.setHeader('X-Frame-Options', 'DENY')
  event.node.res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
  event.node.res.setHeader('X-Quiz-Checksum', responseChecksum)

  return responseData
}

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

function transformQuestionForClient(question: QuizQuestion, sessionToken: string): QuizQuestion {
  // Remove sensitive information and apply enhanced obfuscation
  const transformed: QuizQuestion = {
    id: question.id,
    type: question.type,
    text: secretManager.obfuscateContent(question.text, question.id, sessionToken),
    options: question.options
      ? question.options.map((opt: string) =>
          secretManager.obfuscateContent(opt, question.id, sessionToken)
        )
      : undefined,
    difficulty: question.difficulty,
    category: question.category,
    hints: question.hints
      ? question.hints.map((h: string) =>
          secretManager.obfuscateContent(h, question.id, sessionToken)
        )
      : undefined,
    timeBomb: question.timeBomb,
    moveButton: question.moveButton,
    fourthWall: question.fourthWall,
    answer: question.answer
  }

  return transformed
}

function getClientIP(event: H3Event): string {
  return (event.node.req.headers['x-forwarded-for'] ||
    event.node.req.headers['x-real-ip'] ||
    event.node.req.connection?.remoteAddress ||
    event.node.req.socket?.remoteAddress ||
    'unknown') as string
}
