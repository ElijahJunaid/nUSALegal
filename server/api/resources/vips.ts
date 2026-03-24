import { vips } from '../../data/vips'
import { defineEventHandler, createError } from 'h3'
import { validateApiAccess } from '../../utils/validateApiAccess'
import { dError } from '../../utils/debug'

export default defineEventHandler(async event => {
  validateApiAccess(event, 'resources/vips')

  try {
    return vips
  } catch (error) {
    dError('Error fetching VIPs:', error)
    throw createError({
      status: 500,
      statusText: 'Failed to fetch VIPs'
    })
  }
})
