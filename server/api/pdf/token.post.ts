interface PdfTokenRequestBody {
  pdfPath: string
}

import { defineEventHandler, readBody, createError } from 'h3'
import { validateOrigin, setCorsHeaders } from '../../utils/validateOrigin'
import { generatePdfToken } from '../../utils/pdfTokens'

export default defineEventHandler(async (event) => {
    
    validateOrigin(event)

    setCorsHeaders(event)

    const body = await readBody(event) as PdfTokenRequestBody
    const { pdfPath } = body

    if (!pdfPath) {
        throw createError({
            status: 400,
            statusText: 'PDF path is required'
        })
    }

    if (pdfPath.includes('..') || pdfPath.includes('~')) {
        throw createError({
            status: 400,
            statusText: 'Invalid PDF path'
        })
    }

    if (!pdfPath.startsWith('bills/') && !pdfPath.startsWith('dcbills/')) {
        throw createError({
            status: 400,
            statusText: 'Invalid PDF path'
        })
    }

    const token = generatePdfToken(pdfPath)

    return {
        token,
        url: `/api/pdf/${token}`
    }
})