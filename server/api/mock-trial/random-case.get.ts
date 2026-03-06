import { getRandomCase } from '../../utils/cases'
import { apiRateLimiter } from '../../utils/rateLimit'
import { defineEventHandler, getQuery, createError } from 'h3'

export default defineEventHandler(async event => {
  console.log(' [DEBUG] Mock trial random case endpoint called')

  try {
    await apiRateLimiter.middleware()(event)
    console.log(' [DEBUG] Rate limit check passed')

    const query = getQuery(event)
    const caseType = (query.type as 'criminal' | 'civil' | undefined) || ''
    console.log(' [DEBUG] Case type requested:', caseType)

    if (!caseType || !['criminal', 'civil'].includes(caseType)) {
      console.log(' [DEBUG] Invalid case type:', caseType)
      throw createError({
        status: 400,
        statusText: 'Invalid case type. Must be "criminal" or "civil"'
      })
    }

    console.log(' [DEBUG] Calling getRandomCase with type:', caseType)
    const caseData = getRandomCase(caseType)
    console.log(' [DEBUG] getRandomCase returned:', caseData ? 'success' : 'null')

    if (!caseData) {
      console.log(' [DEBUG] No case data returned for type:', caseType)
      throw createError({
        status: 404,
        statusText: 'No cases available for this type'
      })
    }

    console.log(' [DEBUG] Returning case data:', caseData.title)
    return {
      success: true,
      case: caseData
    }
  } catch (error: any) {
    console.error(' [ERROR] Mock trial endpoint failed:', {
      message: error?.message,
      status: error?.statusCode,
      statusText: error?.statusText,
      stack: error?.stack
    })
    throw error
  }
})
