import { congressBills } from '../../data/congress-bills'
import { defineEventHandler, createError } from 'h3'
import { validateApiAccess } from '../../utils/validateApiAccess'
import { dError } from '../../utils/debug'

export default defineEventHandler(async event => {
  validateApiAccess(event, 'bills/congress')

  try {
    return congressBills
  } catch (error) {
    dError('Error fetching congress bills:', error)
    throw createError({
      status: 500,
      statusText: 'Failed to fetch congress bills'
    })
  }
})
