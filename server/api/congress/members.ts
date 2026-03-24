import { congressMembers, activeSessions } from '../../data/congress-members'
import { defineEventHandler, createError } from 'h3'
import { validateApiAccess } from '../../utils/validateApiAccess'
import { dError } from '../../utils/debug'

export default defineEventHandler(async event => {
  validateApiAccess(event, 'congress/members')

  try {
    return { members: congressMembers, activeSessions }
  } catch (error) {
    dError('Error fetching congress members:', error)
    throw createError({
      status: 500,
      statusText: 'Failed to fetch congress members'
    })
  }
})
