import { defineEventHandler, getQuery, createError } from 'h3'
import { validateOrigin } from '../utils/validateOrigin'

export default defineEventHandler(async event => {
  try {
    validateOrigin(event)

    const query = getQuery(event)
    const rnd = query.rnd as string

    console.log('🔐 [DEBUG] Ably auth endpoint called', { rnd })

    // Check if Ably configuration exists
    if (!process.env.ABLY_API_KEY) {
      console.error('❌ [ERROR] ABLY_API_KEY not configured')
      throw createError({
        status: 500,
        statusText: 'Ably not configured'
      })
    }

    // Generate a simple token for Ably authentication
    // In production, you might want to use proper Ably token generation
    const tokenData = {
      keyName: process.env.ABLY_API_KEY.split(':')[0] || 'default-key',
      token: 'mock-token-' + Date.now(),
      expires: Math.floor(Date.now() / 1000) + 3600, // 1 hour
      capability: {
        '*': ['subscribe', 'publish', 'presence']
      },
      clientId: `client-${rnd || 'unknown'}`
    }

    console.log('✅ [DEBUG] Generated Ably token for client:', tokenData.clientId)

    return tokenData
  } catch (error: unknown) {
    console.error('❌ [ERROR] Ably auth failed:', error)

    if ((error as Record<string, unknown>)?.statusCode) {
      throw error
    }

    throw createError({
      status: 500,
      statusText: 'Failed to generate Ably token'
    })
  }
})
