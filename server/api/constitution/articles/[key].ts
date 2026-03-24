import { articles } from '../../../data/constitution'
import { defineEventHandler, getRouterParam, createError } from 'h3'
import { validateApiAccess } from '../../../utils/validateApiAccess'
import { dLog, dError } from '../../../utils/debug'

export default defineEventHandler(async event => {
  dLog('🔍 [DEBUG] Constitution Articles API called (static data)')

  try {
    dLog('🔐 [DEBUG] Validating API access...')
    validateApiAccess(event, 'constitution/articles')
    dLog('✅ [DEBUG] API access validated')

    const key = getRouterParam(event, 'key')

    if (!key) return []

    if (!Object.hasOwn(articles, key)) return []

    dLog('📊 [DEBUG] Returning article:', key)
    return articles[key]
  } catch (error) {
    dError('❌ [ERROR] Constitution Articles API failed:', error)
    throw createError({
      status: 500,
      statusText: 'Failed to fetch constitution article',
      cause: error instanceof Error ? error.message : String(error)
    })
  }
})
