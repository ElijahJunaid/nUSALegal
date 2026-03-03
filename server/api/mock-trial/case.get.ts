import { getCaseById } from '../../utils/cases'
import { apiRateLimiter } from '../../utils/rateLimit'
import { defineEventHandler, getQuery, createError } from 'h3'

export default defineEventHandler(async (event) => {
  
  await apiRateLimiter.middleware()(event)
  const query = getQuery(event)
  const caseType = (query.type as 'criminal' | 'civil' | undefined) || ''
  const caseId = (query.id as string) || ''
  
  if (!caseType || !['criminal', 'civil'].includes(caseType)) {
    throw createError({
      status: 400,
      statusText: 'Invalid case type. Must be "criminal" or "civil"'
    })
  }
  
  if (!caseId) {
    throw createError({
      status: 400,
      statusText: 'Case ID is required'
    })
  }
  
  const caseData = getCaseById(caseType, caseId)
  
  if (!caseData) {
    throw createError({
      status: 404,
      statusText: 'Case not found'
    })
  }
  
  return {
    success: true,
    case: caseData
  }
})