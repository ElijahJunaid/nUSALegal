import { defineEventHandler, readBody, createError, getQuery, type H3Event } from 'h3'
import { validateApiAccess } from '../../utils/validateApiAccess'
import { dLog, dError } from '../../utils/debug'
import { secretManager } from '../../utils/secret-manager'
import { allAchievements } from '../../data/achievements'
import crypto from 'crypto'

import type { Achievement, AchievementGameState } from '../../data/achievements'

interface SessionState {
  completedQuestions: unknown[]
  discoveredSecrets: number[]
  failedAttempts: Record<string, number>
  lastActivity: number
}

interface _AchievementShowcaseRequest {
  sessionToken: string
  category?: string
  rarity?: string
  search?: string
  sortBy?: 'name' | 'points' | 'rarity' | 'category' | 'unlocked'
  sortOrder?: 'asc' | 'desc'
  page?: number
  limit?: number
  checksum?: string
  timestamp?: number
}

interface _LeaderboardRequest {
  sessionToken: string
  type: 'global' | 'friends' | 'category'
  category?: string
  timeframe?: 'daily' | 'weekly' | 'monthly' | 'all-time'
  checksum?: string
  timestamp?: number
}

interface _ComparisonRequest {
  sessionToken: string
  targetUserId?: string
  achievementIds?: string[]
  checksum?: string
  timestamp?: number
}

interface _ShareRequest {
  sessionToken: string
  achievementId: string
  platform?: 'twitter' | 'facebook' | 'discord' | 'reddit'
  message?: string
  checksum?: string
  timestamp?: number
}

interface _HintRequest {
  sessionToken: string
  achievementId: string
  checksum?: string
  timestamp?: number
}

interface AchievementUnlockRequest {
  sessionToken: string
  achievementId?: string
  secretCode?: string
  action?: string
  questionProgress?: Record<string, unknown>
  timeSpent?: number
  checksum?: string
  timestamp?: number
  // Showcase fields
  category?: string
  rarity?: string
  search?: string
  sortBy?: 'name' | 'points' | 'rarity' | 'category' | 'unlocked'
  sortOrder?: 'asc' | 'desc'
  page?: number
  limit?: number
  // Leaderboard fields
  type?: string
  timeframe?: string
  // Comparison fields
  targetUserId?: string
  achievementIds?: string[]
  // Share fields
  platform?: string
  message?: string
}

interface QueryParams {
  action?: string
  sessionToken?: string
  category?: string
  rarity?: string
  search?: string
  sortBy?: 'name' | 'points' | 'rarity' | 'category' | 'unlocked'
  sortOrder?: 'asc' | 'desc'
  page?: number
  limit?: number
  type?: string
  timeframe?: string
  targetUserId?: string
  achievementIds?: string[]
  platform?: string
  message?: string
  achievementId?: string
}

export default defineEventHandler(async event => {
  dLog('🏆 [ACHIEVEMENTS] Secure achievement API called')

  try {
    dLog('🔐 [ACHIEVEMENTS] Validating API access...')
    validateApiAccess(event, 'achievements/secure')
    dLog('✅ [ACHIEVEMENTS] API access validated')

    const method = event.node.req.method
    const clientIP = getClientIP(event)

    // Rate limiting check
    const identifier = event.node.req.headers['user-agent'] || 'unknown'
    if (!secretManager.checkRateLimit(identifier, clientIP)) {
      dError('❌ [ACHIEVEMENTS] Rate limit exceeded')
      throw createError({
        status: 429,
        statusText: 'Too many requests'
      })
    }

    if (method === 'POST') {
      const body = (await readBody(event)) as AchievementUnlockRequest
      const { action } = body as AchievementUnlockRequest

      if (action === 'showcase') {
        return handleAchievementShowcase(body as AchievementUnlockRequest, event)
      } else if (action === 'leaderboard') {
        return handleLeaderboard(body as AchievementUnlockRequest, event)
      } else if (action === 'comparison') {
        return handleComparison(body as AchievementUnlockRequest, event)
      } else if (action === 'share') {
        return handleAchievementShare(body as AchievementUnlockRequest, event)
      } else if (action === 'hint') {
        return handleAchievementHint(body as AchievementUnlockRequest, event)
      } else {
        return handleAchievementUnlock(body, event)
      }
    } else if (method === 'GET') {
      const query = getQuery(event)
      const { action } = query as { action?: string }

      if (action === 'showcase') {
        return handleAchievementShowcase(query as QueryParams, event)
      } else if (action === 'leaderboard') {
        return handleLeaderboard(query as QueryParams, event)
      } else if (action === 'comparison') {
        return handleComparison(query as QueryParams, event)
      } else {
        return handleAchievementList(event)
      }
    } else {
      throw createError({
        status: 405,
        statusText: 'Method not allowed'
      })
    }
  } catch (error: unknown) {
    dError('❌ [ACHIEVEMENTS] API failed:', error)
    throw error
  }
})

async function handleAchievementUnlock(body: AchievementUnlockRequest, event: H3Event) {
  const {
    sessionToken,
    achievementId,
    secretCode,
    questionProgress,
    timeSpent,
    checksum: _checksum,
    timestamp: _timestamp
  } = body

  // Validate session token
  if (!sessionToken || !isValidSessionToken(sessionToken)) {
    dError('❌ [ACHIEVEMENTS] Invalid session token')
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
    dError('❌ [ACHIEVEMENTS] Request integrity validation failed')
    throw createError({
      status: 400,
      statusText: 'Request integrity validation failed'
    })
  }

  // Get session state
  const sessionState = secretManager.getSessionState(sessionToken) || {
    completedQuestions: [],
    discoveredSecrets: [],
    failedAttempts: {},
    lastActivity: Date.now()
  }

  // Find achievement
  const achievement = allAchievements.find(a => a.id === achievementId)
  if (!achievement) {
    dError('❌ [ACHIEVEMENTS] Achievement not found:', achievementId)
    throw createError({
      status: 404,
      statusText: 'Achievement not found'
    })
  }

  // Check if already unlocked
  if (sessionState.discoveredSecrets.includes(parseInt(achievementId))) {
    dError('❌ [ACHIEVEMENTS] Achievement already unlocked:', achievementId)
    throw createError({
      status: 409,
      statusText: 'Achievement already unlocked'
    })
  }

  // Validate achievement requirements
  const isValidUnlock = await validateAchievementRequirements(
    achievement,
    sessionState,
    secretCode,
    questionProgress as Record<string, unknown>,
    timeSpent
  )

  if (!isValidUnlock.valid) {
    dError('❌ [ACHIEVEMENTS] Achievement requirements not met:', isValidUnlock.reason)
    throw createError({
      status: 400,
      statusText: isValidUnlock.reason || 'Requirements not met'
    })
  }

  // Unlock achievement
  try {
    const secretContent = await secretManager.loadSecretContent(
      parseInt(achievementId),
      sessionToken
    )

    dLog(`🎉 [ACHIEVEMENTS] Achievement unlocked: ${achievementId}`)

    // Prepare response
    const responseData = {
      success: true,
      achievement: {
        id: achievement.id,
        name: achievement.name,
        description: achievement.description,
        category: achievement.category,
        rarity: achievement.rarity,
        points: achievement.points,
        icon: achievement.icon,
        unlockedAt: Date.now()
      },
      secretContent,
      sessionToken: generateNewSessionToken(sessionToken),
      timestamp: Date.now()
    }

    // Add checksum for response integrity
    const responseChecksum = secretManager.generateChecksum(responseData, sessionToken)

    // Add security headers
    event.node.res.setHeader('X-Content-Type-Options', 'nosniff')
    event.node.res.setHeader('X-Frame-Options', 'DENY')
    event.node.res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
    event.node.res.setHeader('X-Achievement-Checksum', responseChecksum)

    return responseData
  } catch (error) {
    dError('❌ [ACHIEVEMENTS] Failed to unlock achievement:', error)
    throw createError({
      status: 500,
      statusText: 'Failed to unlock achievement'
    })
  }
}

async function handleAchievementList(event: H3Event) {
  const query = getQuery(event)
  const sessionToken = query.sessionToken as string

  if (!sessionToken || !isValidSessionToken(sessionToken)) {
    dError('❌ [ACHIEVEMENTS] Invalid session token')
    throw createError({
      status: 401,
      statusText: 'Invalid session token'
    })
  }

  // Get session state
  const sessionState = secretManager.getSessionState(sessionToken) || {
    completedQuestions: [],
    discoveredSecrets: [],
    failedAttempts: {},
    lastActivity: Date.now()
  }

  // Filter achievements based on progress and visibility
  const visibleAchievements = allAchievements.filter(achievement => {
    // Secret achievements are only visible if discovered
    if (achievement.secret && !sessionState.discoveredSecrets.includes(parseInt(achievement.id))) {
      return false
    }

    // Some achievements require certain progress to become visible
    if (achievement.category === 'secret' && sessionState.completedQuestions.length < 5) {
      return false
    }

    return true
  })

  // Transform achievements for client (obfuscate secret ones)
  const transformedAchievements = visibleAchievements.map(achievement => {
    if (achievement.secret && !sessionState.discoveredSecrets.includes(parseInt(achievement.id))) {
      // Obfuscate secret achievements that haven't been discovered
      return {
        id: achievement.id,
        name: '???',
        description: 'Complete secret objectives to unlock',
        category: 'secret',
        rarity: achievement.rarity,
        points: 0,
        icon: '🔒',
        secret: true,
        locked: true
      }
    }

    return {
      id: achievement.id,
      name: achievement.name,
      description: achievement.description,
      category: achievement.category,
      rarity: achievement.rarity,
      points: achievement.points,
      icon: achievement.icon,
      secret: achievement.secret,
      locked: !sessionState.discoveredSecrets.includes(parseInt(achievement.id))
    }
  })

  const responseData = {
    success: true,
    achievements: transformedAchievements,
    totalPoints: calculateTotalPoints(sessionState.discoveredSecrets),
    unlockedCount: sessionState.discoveredSecrets.length,
    totalCount: visibleAchievements.length,
    sessionToken: generateNewSessionToken(sessionToken),
    timestamp: Date.now()
  }

  // Add security headers
  event.node.res.setHeader('X-Content-Type-Options', 'nosniff')
  event.node.res.setHeader('X-Frame-Options', 'DENY')
  event.node.res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')

  return responseData
}

async function validateAchievementRequirements(
  achievement: Achievement,
  sessionState: SessionState,
  secretCode?: string,
  questionProgress?: Record<string, unknown>,
  timeSpent?: number
): Promise<{ valid: boolean; reason?: string }> {
  switch (achievement.id) {
    case 'konami_master':
      // Must enter Konami code
      return secretCode === '↑↑↓↓←→←→BA'
        ? { valid: true }
        : { valid: false, reason: 'Incorrect secret code' }
    case 'quiz_master':
      // Must complete all quiz questions correctly
      return sessionState.completedQuestions.length > 0 &&
        sessionState.failedAttempts &&
        Object.keys(sessionState.failedAttempts).length === 0
        ? { valid: true }
        : { valid: false, reason: 'Must complete all quiz questions correctly' }
    case 'speed_demon':
      // Must complete quiz in under 30 seconds
      return timeSpent && timeSpent < 30000
        ? { valid: true }
        : { valid: false, reason: 'Must complete quiz in under 30 seconds' }
    case 'perfectionist':
      // Must achieve perfect score
      return sessionState.completedQuestions.length > 0 &&
        sessionState.failedAttempts &&
        Object.keys(sessionState.failedAttempts).length === 0
        ? { valid: true }
        : { valid: false, reason: 'Must achieve perfect score' }
    default:
      // Check if achievement has a custom unlock condition
      if (achievement.unlockCondition) {
        try {
          // Convert SessionState to AchievementGameState for the unlock condition
          const gameState: AchievementGameState = {
            questionsAnswered: sessionState.completedQuestions.length,
            totalQuestions: sessionState.completedQuestions.length,
            currentLives: 3,
            skipsUsed: 0,
            timeSpent: timeSpent || 0,
            correctAnswers:
              sessionState.completedQuestions.length -
              (Object.keys(sessionState.failedAttempts).length || 0),
            wrongAnswers: Object.keys(sessionState.failedAttempts).length || 0,
            secretsFound: sessionState.discoveredSecrets.map(id => id.toString()),
            questionsByCategory: {},
            questionsByDifficulty: {},
            comboCount: 0,
            maxCombo: 0,
            perfectSections: 0,
            totalAttempts:
              sessionState.completedQuestions.length +
              (Object.keys(sessionState.failedAttempts).length || 0),
            gamesPlayed: 1,
            gamesWon: 1,
            fastestTime: timeSpent || 30000,
            slowestTime: timeSpent || 30000,
            achievementsUnlocked: sessionState.discoveredSecrets.map(id => id.toString()),
            lastPlayed: new Date(),
            firstPlayed: new Date()
          }
          return { valid: achievement.unlockCondition(gameState) }
        } catch {
          return { valid: false, reason: 'Failed to validate achievement requirements' }
        }
      }
      // Default to valid if no special requirements
      return { valid: true }
  }
}

function calculateTotalPoints(discoveredSecrets: number[]): number {
  return discoveredSecrets.reduce((total, secretId) => {
    const achievement = allAchievements.find(a => a.id === secretId.toString())
    return total + (achievement?.points || 0)
  }, 0)
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

function getClientIP(event: H3Event): string {
  return (event.node.req.headers['x-forwarded-for'] ||
    event.node.req.headers['x-real-ip'] ||
    event.node.req.connection?.remoteAddress ||
    event.node.req.socket?.remoteAddress ||
    'unknown') as string
}

// Achievement showcase with filtering, sorting, and search
async function handleAchievementShowcase(request: QueryParams, _event: H3Event) {
  // Get session token from query or use default for demo
  const sessionToken = request.sessionToken || 'demo-token'
  const {
    category,
    rarity,
    search,
    sortBy = 'name',
    sortOrder = 'asc',
    page = 1,
    limit = 50
  } = request

  if (!sessionToken || !isValidSessionToken(sessionToken)) {
    throw createError({
      status: 401,
      statusText: 'Invalid session token'
    })
  }

  const sessionState =
    secretManager.getSessionState(sessionToken) ||
    secretManager.initializeSessionState(sessionToken)

  const achievements = allAchievements.filter(achievement => {
    // Filter out secret achievements that haven't been discovered
    if (achievement.secret && !sessionState.discoveredSecrets.includes(parseInt(achievement.id))) {
      return false
    }

    // Apply category filter
    if (category && achievement.category !== category) return false

    // Apply rarity filter
    if (rarity && achievement.rarity !== rarity) return false

    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase()
      return (
        achievement.name.toLowerCase().includes(searchLower) ||
        achievement.description.toLowerCase().includes(searchLower)
      )
    }

    return true
  })

  // Sort achievements
  achievements.sort((a, b) => {
    let comparison = 0

    switch (sortBy) {
      case 'name':
        comparison = a.name.localeCompare(b.name)
        break
      case 'points':
        comparison = a.points - b.points
        break
      case 'rarity':
        comparison = a.rarity.localeCompare(b.rarity)
        break
      case 'category':
        comparison = a.category.localeCompare(b.category)
        break
      case 'unlocked': {
        const aUnlocked = sessionState.discoveredSecrets.includes(parseInt(a.id))
        const bUnlocked = sessionState.discoveredSecrets.includes(parseInt(b.id))
        comparison = (aUnlocked ? 1 : 0) - (bUnlocked ? 1 : 0)
        break
      }
    }

    return sortOrder === 'desc' ? -comparison : comparison
  })

  // Pagination
  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit
  const paginatedAchievements = achievements.slice(startIndex, endIndex)

  // Calculate progress for each achievement
  const achievementsWithProgress = paginatedAchievements.map(achievement => {
    const isUnlocked = sessionState.discoveredSecrets.includes(parseInt(achievement.id))
    const progress = isUnlocked
      ? 100
      : calculateAchievementProgress(achievement.id, {
          questionsAnswered: sessionState.completedQuestions.length,
          totalQuestions: sessionState.completedQuestions.length,
          currentLives: 3,
          skipsUsed: 0,
          timeSpent: 0,
          correctAnswers:
            sessionState.completedQuestions.length -
            (Object.keys(sessionState.failedAttempts).length || 0),
          wrongAnswers: Object.keys(sessionState.failedAttempts).length || 0,
          secretsFound: sessionState.discoveredSecrets.map(id => id.toString()),
          questionsByCategory: {},
          questionsByDifficulty: {},
          comboCount: 0,
          maxCombo: 0,
          perfectSections: 0,
          totalAttempts:
            sessionState.completedQuestions.length +
            (Object.keys(sessionState.failedAttempts).length || 0),
          gamesPlayed: 1,
          gamesWon: 1,
          fastestTime: 30000,
          slowestTime: 30000,
          achievementsUnlocked: sessionState.discoveredSecrets.map(id => id.toString()),
          lastPlayed: new Date(),
          firstPlayed: new Date()
        } as AchievementGameState)

    return {
      ...achievement,
      unlocked: isUnlocked,
      progress,
      progressBars: generateProgressBars(achievement, progress)
    }
  })

  return {
    success: true,
    achievements: achievementsWithProgress,
    pagination: {
      page,
      limit,
      total: achievements.length,
      totalPages: Math.ceil(achievements.length / limit)
    },
    filters: { category, rarity, search, sortBy, sortOrder },
    sessionToken: generateNewSessionToken(sessionToken),
    timestamp: Date.now()
  }
}

// Leaderboards for achievement counts and completion rates
async function handleLeaderboard(request: QueryParams, _event: H3Event) {
  const { sessionToken = 'demo-token', type = 'global', category, timeframe = 'all-time' } = request

  if (!sessionToken || !isValidSessionToken(sessionToken)) {
    throw createError({
      status: 401,
      statusText: 'Invalid session token'
    })
  }

  // Mock leaderboard data - in production, this would come from a database
  const mockLeaderboard = [
    {
      userId: 'user1',
      username: 'QuizMaster',
      achievements: 1200,
      completionRate: 81.4,
      points: 15420
    },
    {
      userId: 'user2',
      username: 'AchievementHunter',
      achievements: 1150,
      completionRate: 78.0,
      points: 14850
    },
    {
      userId: 'user3',
      username: 'SecretFinder',
      achievements: 1100,
      completionRate: 74.6,
      points: 14230
    },
    {
      userId: 'user4',
      username: 'Perfectionist',
      achievements: 1050,
      completionRate: 71.2,
      points: 13610
    },
    {
      userId: 'user5',
      username: 'SpeedRunner',
      achievements: 1000,
      completionRate: 67.8,
      points: 12990
    }
  ]

  // Filter by category if specified
  let filteredLeaderboard = mockLeaderboard
  if (category) {
    filteredLeaderboard = mockLeaderboard.map(player => ({
      ...player,
      achievements: Math.floor(player.achievements * 0.7), // Mock category-specific count
      completionRate: player.completionRate * 0.8
    }))
  }

  return {
    success: true,
    leaderboard: filteredLeaderboard,
    type,
    category,
    timeframe,
    sessionToken: generateNewSessionToken(sessionToken),
    timestamp: Date.now()
  }
}

// Badge comparison features between players
async function handleComparison(request: QueryParams, _event: H3Event) {
  const { sessionToken = 'demo-token', targetUserId, achievementIds } = request

  if (!sessionToken || !isValidSessionToken(sessionToken)) {
    throw createError({
      status: 401,
      statusText: 'Invalid session token'
    })
  }

  const sessionState =
    secretManager.getSessionState(sessionToken) ||
    secretManager.initializeSessionState(sessionToken)

  // Mock target user data - in production, fetch from database
  const mockTargetUser = {
    userId: targetUserId || 'user2',
    username: 'ComparisonPlayer',
    achievements: targetUserId ? 850 : sessionState.discoveredSecrets.length,
    completionRate: targetUserId
      ? 57.6
      : (sessionState.discoveredSecrets.length / allAchievements.length) * 100
  }

  // Get achievements to compare
  let achievementsToCompare = allAchievements
  if (achievementIds && achievementIds.length > 0) {
    achievementsToCompare = allAchievements.filter(a => achievementIds.includes(a.id))
  }

  const comparison = achievementsToCompare.map(achievement => {
    const currentUserUnlocked = sessionState.discoveredSecrets.includes(parseInt(achievement.id))
    const targetUserUnlocked = targetUserId ? Math.random() > 0.5 : currentUserUnlocked // Mock target user progress

    return {
      achievement,
      currentUser: { unlocked: currentUserUnlocked },
      targetUser: { unlocked: targetUserUnlocked },
      bothUnlocked: currentUserUnlocked && targetUserUnlocked,
      neitherUnlocked: !currentUserUnlocked && !targetUserUnlocked
    }
  })

  const stats = {
    totalAchievements: achievementsToCompare.length,
    currentUserUnlocked: comparison.filter(c => c.currentUser.unlocked).length,
    targetUserUnlocked: comparison.filter(c => c.targetUser.unlocked).length,
    bothUnlocked: comparison.filter(c => c.bothUnlocked).length,
    neitherUnlocked: comparison.filter(c => c.neitherUnlocked).length
  }

  return {
    success: true,
    comparison,
    stats,
    targetUser: mockTargetUser,
    sessionToken: generateNewSessionToken(sessionToken),
    timestamp: Date.now()
  }
}

// Achievement sharing system for social features
async function handleAchievementShare(request: QueryParams, _event: H3Event) {
  const { sessionToken = 'demo-token', achievementId, platform = 'twitter', message } = request

  if (!sessionToken || !isValidSessionToken(sessionToken)) {
    throw createError({
      status: 401,
      statusText: 'Invalid session token'
    })
  }

  const achievement = allAchievements.find(a => a.id === achievementId)
  if (!achievement) {
    throw createError({
      status: 404,
      statusText: 'Achievement not found'
    })
  }

  const sessionState =
    secretManager.getSessionState(sessionToken) ||
    secretManager.initializeSessionState(sessionToken)
  const isUnlocked = sessionState.discoveredSecrets.includes(parseInt(achievementId))

  if (!isUnlocked) {
    throw createError({
      status: 400,
      statusText: 'Achievement not unlocked'
    })
  }

  // Generate shareable content
  const shareMessages = {
    twitter: `Just unlocked "${achievement.name}" in the nUSA Impossible Quiz! 🏆 ${achievement.points} points`,
    facebook: `I just earned the "${achievement.name}" achievement in the nUSA Impossible Quiz! ${achievement.description}`,
    discord: `🎮 Achievement Unlocked: **${achievement.name}**\n${achievement.description}\nPoints: ${achievement.points}`,
    reddit: `I finally unlocked the "${achievement.name}" achievement in the nUSA Impossible Quiz! ${achievement.description}`
  }

  const shareText = message || shareMessages[platform]
  const shareUrl = `https://nusa-quiz.com/achievements/${achievementId}`

  return {
    success: true,
    shareContent: {
      text: shareText,
      url: shareUrl,
      platform,
      achievement: {
        name: achievement.name,
        description: achievement.description,
        points: achievement.points,
        icon: achievement.icon,
        rarity: achievement.rarity
      }
    },
    sessionToken: generateNewSessionToken(sessionToken),
    timestamp: Date.now()
  }
}

// Achievement hint system for difficult unlocks
async function handleAchievementHint(request: QueryParams, _event: H3Event) {
  const { sessionToken = 'demo-token', achievementId } = request

  if (!sessionToken || !isValidSessionToken(sessionToken)) {
    throw createError({
      status: 401,
      statusText: 'Invalid session token'
    })
  }

  const achievement = allAchievements.find(a => a.id === achievementId)
  if (!achievement) {
    throw createError({
      status: 404,
      statusText: 'Achievement not found'
    })
  }

  const sessionState =
    secretManager.getSessionState(sessionToken) ||
    secretManager.initializeSessionState(sessionToken)
  const isUnlocked = sessionState.discoveredSecrets.includes(parseInt(achievementId))

  if (isUnlocked) {
    throw createError({
      status: 400,
      statusText: 'Achievement already unlocked'
    })
  }

  // Generate hints based on achievement type
  const hints = generateAchievementHints(achievement)

  return {
    success: true,
    achievement: {
      id: achievement.id,
      name: achievement.name,
      category: achievement.category,
      rarity: achievement.rarity
    },
    hints,
    sessionToken: generateNewSessionToken(sessionToken),
    timestamp: Date.now()
  }
}

// Helper functions
function calculateAchievementProgress(
  achievementId: string,
  _sessionState: AchievementGameState
): number {
  // Mock progress calculation - in production, this would be based on actual game state
  const progressMap: Record<string, number> = {
    konami_master: 25,
    classified_access: 50,
    speaker_unlocked: 75,
    quiz_victory: 10
  }

  return progressMap[achievementId] || 0
}

function generateProgressBars(
  achievement: Achievement,
  progress: number
): { type: string; progress: number; max: number; color: string }[] {
  return [{ type: 'overall', progress, max: 100, color: progress === 100 ? 'green' : 'blue' }]
}

function generateAchievementHints(achievement: Achievement): string[] {
  const hintMap: Record<string, string[]> = {
    konami_master: [
      'Try entering a classic gaming code...',
      '↑↑↓↓←→←→BA might work wonders',
      'Look for patterns in the interface'
    ],
    classified_access: [
      'Some secrets require special access codes',
      'CLASSIFIED information might be the key',
      'Think about government clearance levels'
    ],
    speaker_unlocked: [
      'Communication is key in government',
      'Who leads the House of Representatives?',
      'SPEAKER might grant you access'
    ]
  }

  return (
    hintMap[achievement.id] || [
      'Keep exploring the quiz',
      'Try different approaches',
      'Look for hidden patterns'
    ]
  )
}
