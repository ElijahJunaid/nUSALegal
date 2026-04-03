import { defineEventHandler, getQuery, createError } from 'h3'
import { validateApiAccess } from '../../utils/validateApiAccess'
import { dLog, dError } from '../../utils/debug'
import { checkAchievements, getAchievementStats } from '../../data/achievements'
import crypto from 'crypto'

export default defineEventHandler(async event => {
  dLog('🏆 [ACHIEVEMENTS] Check API called')

  try {
    dLog('🔐 [ACHIEVEMENTS] Validating API access...')
    validateApiAccess(event, 'achievements/check')
    dLog('✅ [ACHIEVEMENTS] API access validated')

    const query = getQuery(event)
    const gameState = JSON.parse((query.gameState as string) || '{}')
    const sessionToken = query.sessionToken as string

    // Validate session token
    if (!sessionToken || !isValidSessionToken(sessionToken)) {
      dError('❌ [ACHIEVEMENTS] Invalid session token')
      throw createError({
        status: 401,
        statusText: 'Invalid session token'
      })
    }

    // Check for new achievements
    const newAchievements = checkAchievements(gameState)
    const stats = getAchievementStats(gameState)

    // Add security headers
    event.node.res.setHeader('X-Content-Type-Options', 'nosniff')
    event.node.res.setHeader('X-Frame-Options', 'DENY')
    event.node.res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')

    return {
      success: true,
      newAchievements,
      stats,
      sessionToken: generateNewSessionToken(sessionToken),
      timestamp: Date.now()
    }
  } catch (error: unknown) {
    dError('❌ [ACHIEVEMENTS] Check API failed:', error)
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
