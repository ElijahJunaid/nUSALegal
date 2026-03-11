import { defineEventHandler, getQuery, createError } from 'h3'
import Ably from 'ably'
import { validateOrigin } from '../utils/validateOrigin'

export default defineEventHandler(async event => {
  try {
    validateOrigin(event)

    const query = getQuery(event)
    const rnd = query.rnd as string

    console.log('🔐 [DEBUG] Ably auth endpoint called', { rnd })

    if (!process.env.ABLY_API_KEY) {
      console.error('❌ [ERROR] ABLY_API_KEY not configured')
      throw createError({
        status: 500,
        statusText: 'Ably not configured'
      })
    }

    const clientId = `client-${rnd || 'unknown'}`
    const client = new Ably.Rest({ key: process.env.ABLY_API_KEY })

    const tokenRequest = await client.auth.createTokenRequest({
      clientId,
      capability: { '*': ['subscribe', 'publish', 'presence'] },
      ttl: 3600 * 1000
    })

    console.log('✅ [DEBUG] Generated Ably token request for client:', clientId)

    return tokenRequest
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
