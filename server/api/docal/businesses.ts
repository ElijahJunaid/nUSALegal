import { docalBusinesses } from '../../data/docal-businesses'
import { defineEventHandler, createError } from 'h3'
import { validateApiAccess } from '../../utils/validateApiAccess'

export default defineEventHandler(async event => {
  validateApiAccess(event, 'docal/businesses')

  try {
    return docalBusinesses
  } catch (error) {
    console.error('Error fetching DOCAL businesses:', error)
    throw createError({
      status: 500,
      statusText: 'Failed to fetch DOCAL businesses'
    })
  }
})
