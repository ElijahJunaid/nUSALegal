

import axios from 'axios'
import { defaultRateLimiter } from '../utils/rateLimit'

export default defineEventHandler(async (event) => {
  
  await defaultRateLimiter.middleware()(event)

  const body = await readBody(event)
  const { userId } = body

  if (!userId || typeof userId !== 'string' || !/^[0-9]+$/.test(userId) || userId.length > 32) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      message: 'Invalid user ID: must be a numeric string of 32 characters or less'
    })
  }

  const config = useRuntimeConfig()
  const apiKey = config.nusaApiKey

  if (!apiKey || typeof apiKey !== 'string' || apiKey.trim() === '') {
    console.error('Invalid or missing NUSA_API_KEY')
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      message: 'Invalid or missing API key'
    })
  }

  try {
    const response = await axios.get(
      `https://api.nusa.gg/user/${userId}/bans`,
      {
        timeout: 5000,
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'nUSA Legal Background Check',
          'x-api-key': apiKey
        }
      }
    )

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
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        throw createError({
          statusCode: error.response.status,
          statusMessage: 'API Error',
          message: 'nUSA API error',
          data: error.response.data
        })
      } else if (error.request) {
        throw createError({
          statusCode: 500,
          statusMessage: 'Connection Error',
          message: 'No response from nUSA API'
        })
      }
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      message: 'Failed to check nUSA bans'
    })
  }
})
