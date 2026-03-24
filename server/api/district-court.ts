import { defineEventHandler, createError } from 'h3'
import { validateApiAccess } from '../utils/validateApiAccess'
import { districtCourtCases } from '../data/district-court-cases'
import { dError } from '../utils/debug'

export default defineEventHandler(async event => {
  validateApiAccess(event, 'district-court')

  try {
    return districtCourtCases
  } catch (error) {
    dError('Error fetching district court cases:', error)
    throw createError({
      status: 500,
      statusText: 'Failed to fetch district court cases'
    })
  }
})
