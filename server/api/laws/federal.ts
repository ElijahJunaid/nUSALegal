import { federalLaws } from '../../data/laws'
import { defineEventHandler, createError } from 'h3'
import { validateApiAccess } from '../../utils/validateApiAccess'
import { dError } from '../../utils/debug'

export default defineEventHandler(async event => {
  validateApiAccess(event, 'laws/federal')

  try {
    return federalLaws.map(law => ({
      title: law.title,
      subtitle: law.code,
      content: law.description,
      excerp:
        law.description?.substring(0, 200) +
        (law.description && law.description.length > 200 ? '...' : ''),
      category: law.category,
      section: law.section
    }))
  } catch (error) {
    dError('Error fetching federal laws:', error)
    throw createError({
      status: 500,
      statusText: 'Failed to fetch federal laws'
    })
  }
})
