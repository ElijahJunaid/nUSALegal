import { docalBusinesses } from '../../data/docal-businesses'
import { defineEventHandler, createError } from 'h3'
import { validateApiAccess } from '../../utils/validateApiAccess'
import { dError } from '../../utils/debug'

export default defineEventHandler(async event => {
  validateApiAccess(event, 'docal/businesses')

  try {
    return docalBusinesses
  } catch (error) {
    dError('Error fetching DOCAL businesses:', error)
    throw createError({
      status: 500,
      statusText: 'Failed to fetch DOCAL businesses'
    })
  }
})
