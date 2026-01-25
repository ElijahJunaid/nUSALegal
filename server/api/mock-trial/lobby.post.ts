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
  const body = await readBody(event) as MockTrialLobbyRequestBody
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