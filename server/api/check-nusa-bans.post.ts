import axios from 'axios'
import { defaultRateLimiter } from '../utils/rateLimit'
import { defineEventHandler, createError } from 'h3'
import { useRuntimeConfig } from '#imports'
import { validationSchemas } from '../utils/validation'
import { validateAndReplaceBody } from '../middleware/safe-body'

interface CheckNusaBansRequestBody {
  userId: string
}

export default defineEventHandler(async event => {
  await defaultRateLimiter.middleware()(event)

  // Validate and replace body first to prevent unvalidated access detection
  const validatedBody = await validateAndReplaceBody<CheckNusaBansRequestBody>(
    event,
    validationSchemas.checkNusaBans
  )
  const { userId } = validatedBody

  const config = useRuntimeConfig()
  const apiKey = config.nusaApiKey

  if (!apiKey || typeof apiKey !== 'string' || apiKey.trim() === '') {
    console.error('Invalid or missing NUSA_API_KEY')
    throw createError({
      status: 500,
      statusText: 'Internal Server Error',
      message: 'Invalid or missing API key'
    })
  }

  try {
    const response = await axios.get(`https://api.nusa.gg/user/${userId}/bans`, {
      timeout: 5000,
      headers: {
        Accept: 'application/json',
        'User-Agent': 'nUSA Legal Background Check',
        'x-api-key': apiKey
      }
    })

    if (!response.data || typeof response.data !== 'object') {
      throw new Error('Invalid API response structure')
    }

    if (response.data?.data && response.data.data.length > 0) {
      return {
        result: 'DO NOT HIRE',
        reason: 'Tier 2: Active nUSA ban found'
      }
    }

    return {
      result: 'PASS',
      reason: null
    }
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        throw createError({
          status: error.response.status,
          statusText: 'API Error',
          message: 'nUSA API error'
        })
      } else if (error.request) {
        throw createError({
          status: 500,
          statusText: 'Connection Error',
          message: 'No response from nUSA API'
        })
      }
    }

    throw createError({
      status: 500,
      statusText: 'Internal Server Error',
      message: 'Failed to check nUSA bans'
    })
  }
})
