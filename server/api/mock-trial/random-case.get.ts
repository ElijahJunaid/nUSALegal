import { getRandomCase } from '../../utils/cases'
import { apiRateLimiter } from '../../utils/rateLimit'
import { defineEventHandler, getQuery, createError } from 'h3'
import { dLog, dError } from '../../utils/debug'

export default defineEventHandler(async event => {
  dLog(' [DEBUG] Mock trial random case endpoint called')

  try {
    await apiRateLimiter.middleware()(event)
    dLog(' [DEBUG] Rate limit check passed')

    const query = getQuery(event)
    const caseType = (query.type as 'criminal' | 'civil' | undefined) || ''
    dLog(' [DEBUG] Case type requested:', caseType)

    if (!caseType || !['criminal', 'civil'].includes(caseType)) {
      dLog(' [DEBUG] Invalid case type:', caseType)
      throw createError({
        status: 400,
        statusText: 'Invalid case type. Must be "criminal" or "civil"'
      })
    }

    dLog(' [DEBUG] Calling getRandomCase with type:', caseType)
    const caseData = getRandomCase(caseType)
    dLog(' [DEBUG] getRandomCase returned:', caseData ? 'success' : 'null')

    if (!caseData) {
      dLog(' [DEBUG] No case data returned for type:', caseType)
      throw createError({
        status: 404,
        statusText: 'No cases available for this type'
      })
    }

    dLog(' [DEBUG] Returning case data:', caseData.title)
    return {
      success: true,
      case: caseData
    }
  } catch (error: unknown) {
    const err = error as Record<string, unknown>
    dError(' [ERROR] Mock trial endpoint failed:', {
      message: err?.message,
      status: err?.statusCode,
      statusText: err?.statusText,
      stack: err?.stack
    })
    throw error
  }
})
