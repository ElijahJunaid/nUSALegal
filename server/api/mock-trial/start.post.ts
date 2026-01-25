import { getCaseById, getRandomCase } from '../../utils/cases'
import { apiRateLimiter } from '../../utils/rateLimit'
import { defineEventHandler, readBody, createError } from 'h3'

interface MockTrialStartRequestBody {
  caseType: string
  caseId?: string
  role: string
  playerName: string
}

export default defineEventHandler(async (event) => {
  
  await apiRateLimiter.middleware()(event)
  const body = await readBody(event) as MockTrialStartRequestBody
  const { caseType, caseId, role, playerName } = body

  if (!caseType || !['criminal', 'civil'].includes(caseType)) {
    throw createError({
      status: 400,
      statusText: 'Invalid case type. Must be "criminal" or "civil"'
    })
  }

  const validRoles = ['judge', 'prosecutor', 'plaintiff', 'defense', 'witness', 'jury']
  if (!role || !validRoles.includes(role)) {
    throw createError({
      status: 400,
      statusText: 'Invalid role'
    })
  }

  let caseData
  if (caseId) {
    caseData = getCaseById(caseType as 'criminal' | 'civil', caseId)
  } else {
    caseData = getRandomCase(caseType as 'criminal' | 'civil')
  }
  
  if (!caseData) {
    throw createError({
      status: 404,
      statusText: 'Case not found'
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