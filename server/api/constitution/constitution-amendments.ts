import { constitutionAmendments } from '../../data/constitution'
import { defineEventHandler, createError } from 'h3'
import { validateApiAccess } from '../../utils/validateApiAccess'
import { dLog, dError } from '../../utils/debug'

export default defineEventHandler(async event => {
  dLog('🔍 [DEBUG] Constitution Amendments API called (direct TypeScript import)')

  try {
    dLog('🔐 [DEBUG] Validating API access...')
    validateApiAccess(event, 'constitution/constitution-amendments')
    dLog('✅ [DEBUG] API access validated')

    const result = constitutionAmendments.map(amendment => ({
      title: amendment.title,
      content: amendment.content,
      description: amendment.summary,
      hasArticle: false
    }))

    dLog('📊 [DEBUG] Returning', result.length, 'constitution amendments')
    return result
  } catch (error) {
    dError('❌ [ERROR] Constitution Amendments API failed:', error)
    throw createError({
      status: 500,
      statusText: 'Failed to fetch constitution amendments',
      cause: error instanceof Error ? error.message : String(error)
    })
  }
})
