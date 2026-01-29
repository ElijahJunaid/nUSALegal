import { getAllCases } from '../../utils/cases'
import { apiRateLimiter } from '../../utils/rateLimit'
import { defineEventHandler, getQuery, createError } from 'h3'

export default defineEventHandler(async (event) => {
  
  await apiRateLimiter.middleware()(event)
  const query = getQuery(event)
  const caseType = (query.type as 'criminal' | 'civil' | undefined) || ''
  
  if (!caseType || !['criminal', 'civil'].includes(caseType)) {
    throw createError({
      status: 400,
      statusText: 'Invalid case type. Must be "criminal" or "civil"'
    })
  }
  
  const cases = getAllCases(caseType)
  
  return {
    success: true,
    caseType,
    cases
  }
})