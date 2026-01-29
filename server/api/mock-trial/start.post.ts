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
  let body: MockTrialStartRequestBody
  const { caseType, caseId, role, playerName } = body
  
  try {
    const req = event.node?.req as any
    
    if (req?.body) {
      if (typeof req.body === 'string') {
        body = JSON.parse(req.body) as MockTrialStartRequestBody
      } else if (req.body instanceof Buffer) {
        body = JSON.parse(req.body.toString()) as MockTrialStartRequestBody
      } else if (typeof req.body === 'object') {
        body = req.body as MockTrialStartRequestBody
      } else {
        throw new Error('Invalid body type')
      }
    } else {
      const chunks = []
      for await (const chunk of req) {
        chunks.push(chunk)
      }
      const rawBody = Buffer.concat(chunks).toString()
      body = JSON.parse(rawBody) as MockTrialStartRequestBody
    }
  } catch (error: any) {
    console.error('Failed to parse body:', error.message)
    throw createError({
      status: 400,
      statusText: 'Bad Request',
      message: 'Invalid JSON in request body'
    })
  }

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