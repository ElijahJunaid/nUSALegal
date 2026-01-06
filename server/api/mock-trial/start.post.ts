import { getCaseById, getRandomCase } from '../../utils/cases'
import { apiRateLimiter } from '../../utils/rateLimit'

export default defineEventHandler(async (event) => {
  
  await apiRateLimiter.middleware()(event)
  const body = await readBody(event)
  const { caseType, caseId, role, playerName } = body

  if (!caseType || !['criminal', 'civil'].includes(caseType)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid case type. Must be "criminal" or "civil"'
    })
  }

  const validRoles = ['judge', 'prosecutor', 'plaintiff', 'defense', 'witness', 'jury']
  if (!role || !validRoles.includes(role)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid role'
    })
  }

  let caseData
  if (caseId) {
    caseData = getCaseById(caseType, caseId)
  } else {
    caseData = getRandomCase(caseType)
  }
  
  if (!caseData) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Case not found'
    })
  }

  return {
    success: true,
    trial: {
      caseData,
      playerRole: role,
      playerName: playerName || 'Player',
      caseType,
      startedAt: new Date().toISOString()
    }
  }
})
