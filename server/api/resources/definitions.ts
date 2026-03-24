import { definitions } from '../../data/definitions'
import { defineEventHandler, createError } from 'h3'
import { validateApiAccess } from '../../utils/validateApiAccess'
import { dError } from '../../utils/debug'

export default defineEventHandler(async event => {
  validateApiAccess(event, 'resources/definitions')

  try {
    return definitions
  } catch (error) {
    dError('Error fetching definitions:', error)
    throw createError({
      status: 500,
      statusText: 'Failed to fetch definitions'
    })
  }
})
