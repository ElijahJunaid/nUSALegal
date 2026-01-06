import { getCaseById } from '../../utils/cases'
import { apiRateLimiter } from '../../utils/rateLimit'

export default defineEventHandler(async (event) => {
  
  await apiRateLimiter.middleware()(event)
  const query = getQuery(event)
  const caseType = query.type as 'criminal' | 'civil' | undefined
  const caseId = query.id as string | undefined
  
  if (!caseType || !['criminal', 'civil'].includes(caseType)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid case type. Must be "criminal" or "civil"'
    })
  }
  
  if (!caseId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Case ID is required'
    })
  }
  
  const caseData = getCaseById(caseType, caseId)
  
  if (!caseData) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Case not found'
    })
  }
  
  return {
    success: true,
    case: caseData
  }
})
