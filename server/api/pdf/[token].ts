import { validatePdfToken } from '../../utils/pdfTokens'
import { getPdfFromStorage } from '../../utils/pdfStorage'
import { defineEventHandler, getRouterParam, createError } from 'h3'

export default defineEventHandler(async event => {
  const token = getRouterParam(event, 'token')

  if (!token) {
    throw createError({
      status: 400,
      statusText: 'Token is required'
    })
  }

  const filePath = validatePdfToken(token)

  if (!filePath) {
    throw createError({
      status: 403,
      statusText: 'Invalid or expired token'
    })
  }

  if (filePath.includes('..') || filePath.includes('~')) {
    throw createError({
      status: 403,
      statusText: 'Invalid file path'
    })
  }

  const pdfBuffer = await getPdfFromStorage(filePath)

  if (!pdfBuffer) {
    throw createError({
      status: 404,
      statusText: 'PDF file not found'
    })
  }

  try {
    const filename = filePath.split('/').pop() || 'document.pdf'

    event.node.res.setHeader('Content-Type', 'application/pdf')
    event.node.res.setHeader('Content-Disposition', `inline; filename="${filename}"`)
    event.node.res.setHeader('Cache-Control', 'private, no-cache, no-store, must-revalidate')
    event.node.res.setHeader('Expires', '0')
    event.node.res.setHeader('Pragma', 'no-cache')

    return pdfBuffer
  } catch (_error: unknown) {
    throw createError({
      status: 500,
      statusText: 'Error retrieving PDF file'
    })
  }
})
