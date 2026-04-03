import crypto from 'crypto'
import { dLog, dError } from './debug'

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

// Environment-based secret configuration
interface SecretConfig {
  encryptionKey: string
  checksumSalt: string
  rateLimitWindow: number
  maxRequestsPerWindow: number
  sessionTimeout: number
  obfuscationRounds: number
}

interface SessionState {
  completedQuestions: number[]
  discoveredSecrets: number[]
  failedAttempts: Record<number, number>
  lastActivity: number
  skipsRemaining: number
  currentCheckpoint: number
  fuseBombActive: boolean
  fuseBombStartTime?: number
  fuseBombDuration: number
  questionBank: string[]
  skippedQuestions: number[]
}

interface SecretContent {
  achievement: string
  points: number
  message: string
}

export class SecretManager {
  private config: SecretConfig
  private rateLimitMap = new Map<string, { count: number; resetTime: number }>()
  private sessionState = new Map<string, string>()
  private checksumCache = new Map<string, string>()

  constructor() {
    this.config = {
      encryptionKey: process.env.QUIZ_ENCRYPTION_KEY || this.generateSecureKey(),
      checksumSalt: process.env.QUIZ_CHECKSUM_SALT || this.generateSecureSalt(),
      rateLimitWindow: 60000, // 1 minute
      maxRequestsPerWindow: 100,
      sessionTimeout: 3600000, // 1 hour
      obfuscationRounds: 3
    }
  }

  private generateSecureKey(): string {
    return crypto.randomBytes(32).toString('hex')
  }

  private generateSecureSalt(): string {
    return crypto.randomBytes(16).toString('hex')
  }

  // Enhanced encryption for sensitive data
  encryptSensitiveData(data: SessionState, sessionToken: string): string {
    try {
      const iv = crypto.randomBytes(16)
      const cipher = crypto.createCipheriv(
        'aes-256-cbc',
        Buffer.from(this.getEncryptionKey(sessionToken), 'hex'),
        iv
      )

      let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'hex')
      encrypted += cipher.final('hex')

      return iv.toString('hex') + ':' + encrypted
    } catch (error) {
      dError('❌ [SECRET] Encryption failed:', error)
      throw new Error('Encryption failed', { cause: error })
    }
  }

  decryptSensitiveData(encryptedData: string, sessionToken: string): SessionState {
    try {
      const [ivHex, encrypted] = encryptedData.split(':')
      const iv = Buffer.from(ivHex, 'hex')
      const decipher = crypto.createDecipheriv(
        'aes-256-cbc',
        Buffer.from(this.getEncryptionKey(sessionToken), 'hex'),
        iv
      )

      let decrypted = decipher.update(encrypted, 'hex', 'utf8')
      decrypted += decipher.final('utf8')

      return JSON.parse(decrypted)
    } catch (error) {
      dError('❌ [SECRET] Decryption failed:', error)
      throw new Error('Decryption failed', { cause: error })
    }
  }

  private getEncryptionKey(sessionToken: string): string {
    // Derive encryption key from session token and master key
    return crypto
      .createHash('sha256')
      .update(sessionToken + this.config.encryptionKey)
      .digest('hex')
  }

  // Advanced obfuscation with multiple rounds
  obfuscateContent(content: string, questionId: number, sessionToken: string): string {
    let obfuscated = content

    for (let round = 0; round < this.config.obfuscationRounds; round++) {
      obfuscated = this.singleRoundObfuscation(obfuscated, questionId, sessionToken, round)
    }

    return obfuscated
  }

  deobfuscateContent(obfuscatedContent: string, questionId: number, sessionToken: string): string {
    let deobfuscated = obfuscatedContent

    for (let round = this.config.obfuscationRounds - 1; round >= 0; round--) {
      deobfuscated = this.singleRoundObfuscation(deobfuscated, questionId, sessionToken, round)
    }

    return deobfuscated
  }

  private singleRoundObfuscation(
    text: string,
    questionId: number,
    sessionToken: string,
    round: number
  ): string {
    const seed = this.generateSeed(questionId, sessionToken, round)
    return text
      .split('')
      .map((char, index) => {
        const code = char.charCodeAt(0)
        const obfuscated = code ^ ((seed + index) % 256)
        return String.fromCharCode(obfuscated)
      })
      .join('')
  }

  private generateSeed(questionId: number, sessionToken: string, round: number): number {
    const combined = `${questionId}:${sessionToken}:${round}:${this.config.encryptionKey}`
    const hash = crypto.createHash('md5').update(combined).digest('hex')
    return parseInt(hash.substring(0, 8), 16)
  }

  // Checksum and integrity verification
  generateChecksum(data: unknown, sessionToken: string): string {
    const dataString = JSON.stringify(data) + sessionToken + this.config.checksumSalt
    return crypto.createHash('sha256').update(dataString).digest('hex')
  }

  verifyChecksum(data: unknown, checksum: string, sessionToken: string): boolean {
    const expectedChecksum = this.generateChecksum(data, sessionToken)
    return checksum === expectedChecksum
  }

  // Rate limiting with IP and session tracking
  checkRateLimit(identifier: string, ip: string): boolean {
    const key = `${identifier}:${ip}`
    const now = Date.now()
    const current = this.rateLimitMap.get(key)

    if (!current || now > current.resetTime) {
      this.rateLimitMap.set(key, {
        count: 1,
        resetTime: now + this.config.rateLimitWindow
      })
      return true
    }

    if (current.count >= this.config.maxRequestsPerWindow) {
      dError(`❌ [SECRET] Rate limit exceeded for ${key}`)
      return false
    }

    current.count++
    return true
  }

  // Session state management
  setSessionState(sessionToken: string, state: SessionState): void {
    const encrypted = this.encryptSensitiveData(state, sessionToken)
    this.sessionState.set(sessionToken, encrypted)
  }

  getSessionState(sessionToken: string): SessionState | null {
    const encrypted = this.sessionState.get(sessionToken)
    if (!encrypted) return null

    try {
      return this.decryptSensitiveData(encrypted, sessionToken)
    } catch (_error) {
      dError('❌ [SECRET] Failed to decrypt session state')
      this.sessionState.delete(sessionToken)
      return null
    }
  }

  initializeSessionState(sessionToken: string): SessionState {
    const defaultState: SessionState = {
      completedQuestions: [],
      discoveredSecrets: [],
      failedAttempts: {},
      lastActivity: Date.now(),
      skipsRemaining: 3,
      currentCheckpoint: 0,
      fuseBombActive: false,
      fuseBombDuration: 5000, // 5 seconds default
      questionBank: [],
      skippedQuestions: []
    }
    this.setSessionState(sessionToken, defaultState)
    return defaultState
  }

  // Dynamic question loading with server logic
  filterQuestionsBasedOnProgress(questions: QuizQuestion[], sessionToken: string): QuizQuestion[] {
    const sessionState =
      this.getSessionState(sessionToken) || this.initializeSessionState(sessionToken)
    const completedQuestions = sessionState.completedQuestions || []
    const failedAttempts = sessionState.failedAttempts || {}

    return questions.filter((question: QuizQuestion) => {
      // Skip questions that are already completed
      if (completedQuestions.includes(question.id)) return false

      // Skip questions that have been skipped
      if (sessionState.skippedQuestions.includes(question.id)) return false

      // Apply dynamic difficulty based on performance
      if (failedAttempts[question.id] && failedAttempts[question.id] > 2) {
        // Make question slightly easier after multiple failures
        question.hints = question.hints || []
        if (!question.hints.includes('Need a hint? Try again.')) {
          question.hints.push('Need a hint? Try again.')
        }
      }

      // Unlock secret questions based on progress
      if (question.category === 'secret') {
        const requiredProgress = this.getRequiredProgressForSecret(question.id)
        return completedQuestions.length >= requiredProgress
      }

      return true
    })
  }

  private getRequiredProgressForSecret(secretId: number): number {
    // Define progression requirements for different secrets
    const secretRequirements: Record<number, number> = {
      5: 3, // Konami code - need 3 questions completed
      23: 5, // CLASSIFIED - need 5 questions completed
      46: 10, // SPEAKER - need 10 questions completed
      110: 50 // VICTORY - need 50 questions completed
    }

    return secretRequirements[secretId] || 0
  }

  // Anti-tampering measures
  validateRequestIntegrity(
    body: Record<string, unknown>,
    headers: Record<string, unknown>,
    sessionToken: string
  ): boolean {
    // Check timestamp to prevent replay attacks
    if (body.timestamp && Date.now() - (body.timestamp as number) > 30000) {
      dError('❌ [SECRET] Request timestamp too old')
      return false
    }

    // Validate checksum if provided
    if (body.checksum) {
      if (!this.verifyChecksum(body.data || body, body.checksum as string, sessionToken)) {
        dError('❌ [SECRET] Request checksum validation failed')
        return false
      }
    }

    return true
  }

  // Delayed loading for secret content
  async loadSecretContent(secretId: number, sessionToken: string): Promise<SecretContent> {
    // Add artificial delay to prevent rapid enumeration
    await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 500))

    let sessionState = this.getSessionState(sessionToken)
    if (!sessionState) {
      sessionState = this.initializeSessionState(sessionToken)
    }

    const discoveredSecrets = sessionState.discoveredSecrets || []

    if (discoveredSecrets.includes(secretId)) {
      throw new Error('Secret already discovered')
    }

    // Add to discovered secrets
    sessionState.discoveredSecrets.push(secretId)
    sessionState.lastActivity = Date.now()
    this.setSessionState(sessionToken, sessionState)

    return this.getSecretContent(secretId)
  }

  private getSecretContent(secretId: number): SecretContent | null {
    // Secret content stored server-side only
    const secrets: Record<number, SecretContent> = {
      5: {
        achievement: 'konami_master',
        points: 500,
        message: "🎮 Konami Code Master! You've unlocked the classic gaming secret!"
      },
      23: {
        achievement: 'classified_access',
        points: 400,
        message: '🕵️ Classified Access Granted! Welcome to the executive session.'
      },
      46: {
        achievement: 'speaker_unlocked',
        points: 300,
        message: "🏛️ Speaker Chamber Unlocked! You've found the heart of Congress."
      },
      110: {
        achievement: 'quiz_victory',
        points: 1000,
        message: '🏆 VICTORY! You are the true master of the Impossible Quiz!'
      }
    }

    return secrets[secretId] || null
  }

  // Skip system functionality
  useSkip(sessionToken: string): { success: boolean; skipsRemaining: number } {
    const sessionState =
      this.getSessionState(sessionToken) || this.initializeSessionState(sessionToken)

    if (sessionState.skipsRemaining <= 0) {
      return { success: false, skipsRemaining: 0 }
    }

    sessionState.skipsRemaining--
    sessionState.lastActivity = Date.now()
    this.setSessionState(sessionToken, sessionState)

    return { success: true, skipsRemaining: sessionState.skipsRemaining }
  }

  skipQuestion(
    sessionToken: string,
    questionId: number
  ): { success: boolean; skippedQuestions: number[] } {
    const sessionState =
      this.getSessionState(sessionToken) || this.initializeSessionState(sessionToken)

    if (sessionState.skipsRemaining <= 0) {
      return { success: false, skippedQuestions: sessionState.skippedQuestions }
    }

    if (sessionState.skippedQuestions.includes(questionId)) {
      return { success: false, skippedQuestions: sessionState.skippedQuestions }
    }

    sessionState.skippedQuestions.push(questionId)
    sessionState.skipsRemaining--
    sessionState.lastActivity = Date.now()
    this.setSessionState(sessionToken, sessionState)

    return { success: true, skippedQuestions: sessionState.skippedQuestions }
  }

  // Fuse bomb functionality
  activateFuseBomb(
    sessionToken: string,
    duration: number = 5000
  ): { startTime: number; duration: number } {
    const sessionState =
      this.getSessionState(sessionToken) || this.initializeSessionState(sessionToken)

    sessionState.fuseBombActive = true
    sessionState.fuseBombStartTime = Date.now()
    sessionState.fuseBombDuration = duration
    sessionState.lastActivity = Date.now()
    this.setSessionState(sessionToken, sessionState)

    return { startTime: sessionState.fuseBombStartTime, duration }
  }

  checkFuseBombStatus(sessionToken: string): {
    active: boolean
    exploded?: boolean
    timeRemaining?: number
  } {
    const sessionState =
      this.getSessionState(sessionToken) || this.initializeSessionState(sessionToken)

    if (!sessionState.fuseBombActive) {
      return { active: false }
    }

    const elapsed = Date.now() - (sessionState.fuseBombStartTime || 0)
    const timeRemaining = sessionState.fuseBombDuration - elapsed

    if (elapsed >= sessionState.fuseBombDuration) {
      // Bomb exploded
      sessionState.fuseBombActive = false
      sessionState.lastActivity = Date.now()
      this.setSessionState(sessionToken, sessionState)
      return { active: false, exploded: true }
    }

    return { active: true, timeRemaining: Math.max(0, timeRemaining) }
  }

  // Question bank management
  addToQuestionBank(sessionToken: string, questionId: string): void {
    const sessionState =
      this.getSessionState(sessionToken) || this.initializeSessionState(sessionToken)

    if (!sessionState.questionBank.includes(questionId)) {
      sessionState.questionBank.push(questionId)
      sessionState.lastActivity = Date.now()
      this.setSessionState(sessionToken, sessionState)
    }
  }

  getQuestionBank(sessionToken: string): string[] {
    const sessionState =
      this.getSessionState(sessionToken) || this.initializeSessionState(sessionToken)
    return sessionState.questionBank
  }

  removeFromQuestionBank(sessionToken: string, questionId: string): void {
    const sessionState =
      this.getSessionState(sessionToken) || this.initializeSessionState(sessionToken)

    const index = sessionState.questionBank.indexOf(questionId)
    if (index > -1) {
      sessionState.questionBank.splice(index, 1)
      sessionState.lastActivity = Date.now()
      this.setSessionState(sessionToken, sessionState)
    }
  }

  // Cleanup expired sessions
  cleanupExpiredSessions(): void {
    const now = Date.now()
    for (const [token, encrypted] of this.sessionState.entries()) {
      try {
        const state = this.decryptSensitiveData(encrypted, token)
        if (state.lastActivity && now - state.lastActivity > this.config.sessionTimeout) {
          this.sessionState.delete(token)
          dLog(`🧹 [SECRET] Cleaned up expired session: ${token.substring(0, 8)}...`)
        }
      } catch (_error) {
        this.sessionState.delete(token)
      }
    }

    // Clean up rate limit map
    for (const [key, data] of this.rateLimitMap.entries()) {
      if (now > data.resetTime) {
        this.rateLimitMap.delete(key)
      }
    }
  }
}

// Singleton instance
export const secretManager = new SecretManager()

// Auto-cleanup every 5 minutes
setInterval(() => {
  secretManager.cleanupExpiredSessions()
}, 300000)
