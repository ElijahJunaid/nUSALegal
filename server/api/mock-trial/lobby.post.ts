import { apiRateLimiter } from '../../utils/rateLimit'
import { defineEventHandler, readBody, createError } from 'h3'

interface MockTrialLobbyRequestBody {
  action: string
  lobbyCode?: string
  playerName?: string
  role?: string
}

export default defineEventHandler(async (event) => {
  
  await apiRateLimiter.middleware()(event)
  let body: MockTrialLobbyRequestBody
  
  try {
    const req = event.node?.req as any
    
    if (req?.body) {
      if (typeof req.body === 'string') {
        body = JSON.parse(req.body) as MockTrialLobbyRequestBody
      } else if (req.body instanceof Buffer) {
        body = JSON.parse(req.body.toString()) as MockTrialLobbyRequestBody
      } else if (typeof req.body === 'object') {
        body = req.body as MockTrialLobbyRequestBody
      } else {
        throw new Error('Invalid body type')
      }
    } else {
      const chunks = []
      for await (const chunk of req) {
        chunks.push(chunk)
      }
      const rawBody = Buffer.concat(chunks).toString()
      body = JSON.parse(rawBody) as MockTrialLobbyRequestBody
    }
  } catch (error: any) {
    console.error('Failed to parse body:', error.message)
    throw createError({
      status: 400,
      statusText: 'Bad Request',
      message: 'Invalid JSON in request body'
    })
  }
  const { action, lobbyCode, playerName, role } = body

  if (!action) {
    throw createError({
      status: 400,
      statusText: 'Action is required'
    })
  }

  switch (action) {
    case 'create':
      
      return {
        success: true,
        lobbyCode: generateLobbyCode(),
        message: 'Lobby created'
      }
      
    case 'join':
      
      if (!lobbyCode) {
        throw createError({
          status: 400,
          statusText: 'Lobby code is required'
        })
      }
      return {
        success: true,
        lobbyCode,
        message: 'Joined lobby'
      }
      
    case 'leave':
      
      return {
        success: true,
        message: 'Left lobby'
      }
      
    case 'claim-role':
      
      if (!role) {
        throw createError({
          status: 400,
          statusText: 'Role is required'
        })
      }
      return {
        success: true,
        role,
        message: 'Role claimed'
      }
      
    default:
      throw createError({
        status: 400,
        statusText: 'Invalid action'
      })
  }
})

function generateLobbyCode(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase()
}