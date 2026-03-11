import { congressMembers } from '../../data/congress-members'
import { defineEventHandler, createError } from 'h3'
import { validateApiAccess } from '../../utils/validateApiAccess'

export default defineEventHandler(async event => {
  validateApiAccess(event, 'congress/members')

  try {
    return congressMembers
  } catch (error) {
    console.error('Error fetching congress members:', error)
    throw createError({
      status: 500,
      statusText: 'Failed to fetch congress members'
    })
  }
})
