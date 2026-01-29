import axios from 'axios'
import { defaultRateLimiter } from '../utils/rateLimit'
import { defineEventHandler, readBody, createError } from 'h3'
import { useRuntimeConfig } from '#imports'

interface CheckNusaBansRequestBody {
  userId: string
}

export default defineEventHandler(async (event) => {
  
  await defaultRateLimiter.middleware()(event)

  let body: CheckNusaBansRequestBody
  
  try {
    const req = event.node?.req as any
    
    if (req?.body) {
      if (typeof req.body === 'string') {
        body = JSON.parse(req.body) as CheckNusaBansRequestBody
      } else if (req.body instanceof Buffer) {
        body = JSON.parse(req.body.toString()) as CheckNusaBansRequestBody
      } else if (typeof req.body === 'object') {
        body = req.body as CheckNusaBansRequestBody
      } else {
        throw new Error('Invalid body type')
      }
    } else {
      const chunks = []
      for await (const chunk of req) {
        chunks.push(chunk)
      }
      const rawBody = Buffer.concat(chunks).toString()
      body = JSON.parse(rawBody) as CheckNusaBansRequestBody
    }
  } catch (error: any) {
    console.error('Failed to parse body:', error.message)
    throw createError({
      status: 400,
      statusText: 'Bad Request',
      message: 'Invalid JSON in request body'
    })
  }
  const { userId } = body

  if (!userId || typeof userId !== 'string' || !/^[0-9]+$/.test(userId) || userId.length > 32) {
    throw createError({
      status: 400,
      statusText: 'Bad Request',
      message: 'Invalid user ID: must be a numeric string of 32 characters or less'
    })
  }

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
          status: error.response.status,
          statusText: 'API Error',
          message: 'nUSA API error'
        }) as any
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