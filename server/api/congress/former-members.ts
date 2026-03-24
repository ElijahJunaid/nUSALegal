import { formerCongressMembers } from '../../data/congress-members'
import { defineEventHandler, createError } from 'h3'
import { validateApiAccess } from '../../utils/validateApiAccess'
import { dError } from '../../utils/debug'

export default defineEventHandler(async event => {
  validateApiAccess(event, 'congress/former-members')

  try {
    return { members: formerCongressMembers }
  } catch (error) {
    dError('Error fetching former congress members:', error)
    throw createError({ status: 500, statusText: 'Failed to fetch former congress members' })
  }
})
