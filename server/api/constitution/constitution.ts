import { constitutionArticles } from '../../data/constitution'
import { defineEventHandler, createError } from 'h3'
import { validateApiAccess } from '../../utils/validateApiAccess'
import { dLog, dError } from '../../utils/debug'

export default defineEventHandler(async event => {
  dLog('🔍 [DEBUG] Constitution API called (direct TypeScript import)')

  try {
    dLog('🔐 [DEBUG] Validating API access...')
    validateApiAccess(event, 'constitution/constitution')
    dLog('✅ [DEBUG] API access validated')

    const result = constitutionArticles.map(article => ({
      title: article.title,
      description: article.summary,
      hasArticle: true,
      key: `article${article.number}`
    }))

    dLog('📊 [DEBUG] Returning', result.length, 'constitution articles')
    return result
  } catch (error) {
    dError('❌ [ERROR] Constitution API failed:', error)
    throw createError({
      status: 500,
      statusText: 'Failed to fetch constitution articles',
      cause: error instanceof Error ? error.message : String(error)
    })
  }
})
