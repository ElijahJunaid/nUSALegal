interface PdfTokenRequestBody {
  pdfPath: string
}

import { defineEventHandler, readBody, createError } from 'h3'
import { validateOrigin, setCorsHeaders } from '../../utils/validateOrigin'
import { generatePdfToken } from '../../utils/pdfTokens'

export default defineEventHandler(async (event) => {
    
    validateOrigin(event)

    setCorsHeaders(event)

    let body: PdfTokenRequestBody
    
    try {
        const req = event.node?.req as any
        
        if (req?.body) {
            if (typeof req.body === 'string') {
                body = JSON.parse(req.body) as PdfTokenRequestBody
            } else if (req.body instanceof Buffer) {
                body = JSON.parse(req.body.toString()) as PdfTokenRequestBody
            } else if (typeof req.body === 'object') {
                body = req.body as PdfTokenRequestBody
            } else {
                throw new Error('Invalid body type')
            }
        } else {
            const chunks = []
            for await (const chunk of req) {
                chunks.push(chunk)
            }
            const rawBody = Buffer.concat(chunks).toString()
            body = JSON.parse(rawBody) as PdfTokenRequestBody
        }
    } catch (error: any) {
        console.error('Failed to parse body:', error.message)
        throw createError({
            status: 400,
            statusText: 'Bad Request',
            message: 'Invalid JSON in request body'
        })
    }
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