import { defineEventHandler, readBody, createError, getQuery, type H3Event } from 'h3'
import { validateApiAccess } from '../utils/validateApiAccess'
import { dLog, dError } from '../utils/debug'
import { secretManager } from '../utils/secret-manager'
import { secureContentManager } from '../utils/secure-content-manager'
import { dynamicDifficultyManager } from '../utils/dynamic-difficulty'
import crypto from 'crypto'

interface _ContentManagementRequest {
  sessionToken: string
  action: 'create' | 'update' | 'delete' | 'list' | 'backup' | 'restore'
  contentType: string
  data?: unknown
  versionId?: string
  metadata?: Record<string, unknown>
  checksum?: string
  timestamp?: number
}

interface _AnalyticsRequest {
  sessionToken: string
  action: 'track' | 'get' | 'patterns' | 'system'
  userId?: string
  event?: string
  data?: Record<string, unknown>
  filters?: Record<string, unknown>
  checksum?: string
  timestamp?: number
}

interface _DifficultyRequest {
  sessionToken: string
  action: 'track' | 'get' | 'system' | 'personalize'
  userId?: string
  questionId?: number
  timeSpent?: number
  attempts?: number
  hintsUsed?: number
  success?: boolean
  currentDifficulty?: number
  checksum?: string
  timestamp?: number
}

export default defineEventHandler(async event => {
  dLog('🔒 [SECURE-MGMT] Secure management API called')

  try {
    dLog('🔐 [SECURE-MGMT] Validating API access...')
    validateApiAccess(event, 'secure-management')
    dLog('✅ [SECURE-MGMT] API access validated')

    const method = event.node.req.method
    const query = getQuery(event)
    const { action } = query as { action?: string }

    // Rate limiting
    const clientIP = getClientIP(event)
    const identifier = event.node.req.headers['user-agent'] || 'unknown'
    if (!secretManager.checkRateLimit(identifier, clientIP)) {
      dError('❌ [SECURE-MGMT] Rate limit exceeded')
      throw createError({
        status: 429,
        statusText: 'Too many requests'
      })
    }

    if (method === 'POST') {
      const body = await readBody(event)
      const { sessionToken, action: bodyAction } = body as { sessionToken: string; action?: string }

      if (!sessionToken || !isValidSessionToken(sessionToken)) {
        throw createError({
          status: 401,
          statusText: 'Invalid session token'
        })
      }

      if (bodyAction === 'content') {
        return handleContentManagement(body, event)
      } else if (bodyAction === 'analytics') {
        return handleAnalytics(body, event)
      } else if (bodyAction === 'difficulty') {
        return handleDifficultyManagement(body, event)
      }
    } else if (method === 'GET') {
      if (action === 'content') {
        return handleContentManagement(query, event)
      } else if (action === 'analytics') {
        return handleAnalytics(query, event)
      } else if (action === 'difficulty') {
        return handleDifficultyManagement(query, event)
      }
    }

    throw createError({
      status: 405,
      statusText: 'Method not allowed'
    })
  } catch (error: unknown) {
    dError(' [SECURE-MGMT] API failed:', error)
    throw error
  }
})

// Content management handlers
async function handleContentManagement(
  request: {
    sessionToken?: string
    action?: string
    contentType?: string
    data?: string
    versionId?: string
    metadata?: Record<string, unknown>
  },
  event: H3Event
) {
  const { sessionToken, action, contentType, data, versionId, metadata } = request

  // Validate request integrity
  const bodyForValidation = { action, contentType, versionId, metadata }
  if (
    !secretManager.validateRequestIntegrity(
      bodyForValidation as Record<string, unknown>,
      event.node.req.headers,
      sessionToken
    )
  ) {
    throw createError({
      status: 400,
      statusText: 'Request integrity validation failed'
    })
  }

  // Get user ID from session token (mock implementation)
  const userId = extractUserIdFromToken(sessionToken)

  switch (action) {
    case 'create': {
      if (!data || !contentType) {
        throw createError({
          status: 400,
          statusText: 'Content data and type required for create'
        })
      }

      const version = await secureContentManager.createContent(contentType, data, userId, metadata)

      return {
        success: true,
        action: 'created',
        version,
        contentType,
        timestamp: Date.now()
      }
    }

    case 'update': {
      if (!data || !contentType || !versionId) {
        throw createError({
          status: 400,
          statusText: 'Content data, type, and version ID required for update'
        })
      }

      const newVersion = await secureContentManager.updateContent(
        contentType,
        versionId,
        data,
        userId,
        metadata
      )

      return {
        success: true,
        action: 'updated',
        fromVersion: versionId,
        toVersion: newVersion,
        contentType,
        timestamp: Date.now()
      }
    }

    case 'list': {
      if (!contentType) {
        throw createError({
          status: 400,
          statusText: 'Content type required for listing'
        })
      }

      // In production, this would fetch from the content manager
      return {
        success: true,
        action: 'listed',
        contentType,
        versions: [], // Would come from secureContentManager
        timestamp: Date.now()
      }
    }

    case 'backup': {
      const includeAnalytics = (metadata?.includeAnalytics as boolean) || false
      const backup = await secureContentManager.createBackup(userId, includeAnalytics)

      return {
        success: true,
        action: 'backup_created',
        backup,
        includeAnalytics,
        timestamp: Date.now()
      }
    }

    case 'restore': {
      if (!data || !(data as { backup?: string }).backup) {
        throw createError({
          status: 400,
          statusText: 'Backup data required for restore'
        })
      }

      await secureContentManager.restoreBackup(
        (data as unknown as { backup: string }).backup,
        userId
      )

      return {
        success: true,
        action: 'restored',
        timestamp: Date.now()
      }
    }

    default:
      throw createError({
        status: 400,
        statusText: 'Invalid action'
      })
  }
}

// Analytics handlers
async function handleAnalytics(
  request: {
    sessionToken?: string
    action?: string
    userId?: string
    event?: string
    data?: Record<string, unknown>
    filters?: Record<string, unknown>
  },
  event: H3Event
) {
  const { sessionToken, action, userId, event: eventName, data, filters } = request

  // Validate request integrity
  const bodyForValidation = {
    action,
    userId,
    event: eventName || request.event,
    data,
    filters
  } as Record<string, unknown>
  if (
    !secretManager.validateRequestIntegrity(
      bodyForValidation as Record<string, unknown>,
      event.node.req.headers,
      sessionToken
    )
  ) {
    throw createError({
      status: 400,
      statusText: 'Request integrity validation failed'
    })
  }

  // Get user ID from session token
  const requestUserId = userId || extractUserIdFromToken(sessionToken)

  switch (action) {
    case 'track': {
      if (!eventName || !data) {
        throw createError({
          status: 400,
          statusText: 'Event name and data required for tracking'
        })
      }

      const sessionId = extractSessionIdFromToken(sessionToken)
      secureContentManager.trackAnalyticsEvent(requestUserId, sessionId, eventName, data)

      return {
        success: true,
        action: 'tracked',
        event: eventName,
        timestamp: Date.now()
      }
    }

    case 'get': {
      const analyticsData = secureContentManager.getAnalyticsData(
        filters as Record<string, unknown>
      )

      return {
        success: true,
        action: 'retrieved',
        analytics: analyticsData,
        filters: filters || {},
        timestamp: Date.now()
      }
    }

    case 'patterns': {
      const patterns = secureContentManager.getDiscoveryPatterns(filters as Record<string, unknown>)

      return {
        success: true,
        action: 'retrieved',
        patterns,
        filters: filters || {},
        timestamp: Date.now()
      }
    }

    case 'system': {
      const systemAnalytics = secureContentManager.getSystemAnalytics()

      return {
        success: true,
        action: 'retrieved',
        systemAnalytics,
        timestamp: Date.now()
      }
    }

    default:
      throw createError({
        status: 400,
        statusText: 'Invalid action'
      })
  }
}

// Difficulty management handlers
async function handleDifficultyManagement(
  request: {
    sessionToken?: string
    action?: string
    userId?: string
    questionId?: string
    timeSpent?: number
    attempts?: number
    difficulty?: string
    performance?: Record<string, unknown>
    hintsUsed?: number
    success?: boolean
    currentDifficulty?: string
  },
  event: H3Event
) {
  const {
    sessionToken,
    action,
    userId,
    questionId,
    timeSpent,
    attempts,
    hintsUsed,
    success,
    currentDifficulty
  } = request

  // Validate request integrity
  const bodyForValidation = {
    action,
    userId,
    questionId,
    timeSpent,
    attempts,
    hintsUsed,
    success,
    currentDifficulty
  }
  if (
    !secretManager.validateRequestIntegrity(
      bodyForValidation as Record<string, unknown>,
      event.node.req.headers,
      sessionToken
    )
  ) {
    throw createError({
      status: 400,
      statusText: 'Request integrity validation failed'
    })
  }

  // Get user ID from session token
  const requestUserId = userId || extractUserIdFromToken(sessionToken)
  const _sessionId = extractSessionIdFromToken(sessionToken)

  switch (action) {
    case 'track':
      if (
        !questionId ||
        timeSpent === undefined ||
        attempts === undefined ||
        hintsUsed === undefined ||
        success === undefined
      ) {
        throw createError({
          status: 400,
          statusText: 'Question data required for tracking'
        })
      }

      dynamicDifficultyManager.trackPlayerBehavior(
        requestUserId,
        sessionToken,
        parseInt(questionId),
        timeSpent,
        attempts,
        hintsUsed,
        success,
        currentDifficulty ? parseFloat(currentDifficulty) : 0.5
      )

      return {
        success: true,
        action: 'tracked',
        questionId,
        timestamp: Date.now()
      }

    case 'get': {
      const adjustment = dynamicDifficultyManager.getDifficultyAdjustment(requestUserId)
      const analysis = dynamicDifficultyManager.getBehaviorAnalysis(requestUserId)

      return {
        success: true,
        action: 'retrieved',
        adjustment,
        analysis,
        timestamp: Date.now()
      }
    }

    case 'personalize': {
      const parameters = dynamicDifficultyManager.getPersonalizedParameters(requestUserId)

      if (!parameters) {
        throw createError({
          status: 404,
          statusText: 'User not found or insufficient data'
        })
      }

      return {
        success: true,
        action: 'personalized',
        parameters,
        timestamp: Date.now()
      }
    }

    case 'system': {
      const systemAnalytics = dynamicDifficultyManager.getSystemAnalytics()

      return {
        success: true,
        action: 'system',
        systemAnalytics,
        timestamp: Date.now()
      }
    }

    default:
      throw createError({
        status: 400,
        statusText: 'Invalid action'
      })
  }
}

// Helper functions
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

function extractUserIdFromToken(token: string): string {
  // Mock implementation - in production, this would decode the JWT token
  return token.split(':')[0].substring(0, 8) || 'unknown'
}

function extractSessionIdFromToken(token: string): string {
  // Mock implementation - in production, this would decode the JWT token
  return token.split(':')[1]?.substring(0, 8) || 'unknown'
}

function getClientIP(event: H3Event): string {
  return (event.node.req.headers['x-forwarded-for'] ||
    event.node.req.headers['x-real-ip'] ||
    event.node.req.connection?.remoteAddress ||
    event.node.req.socket?.remoteAddress ||
    'unknown') as string
}
