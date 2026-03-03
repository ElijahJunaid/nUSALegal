import { validatePdfToken } from '../../utils/pdfTokens'
import { getPdfFromStorage } from '../../utils/pdfStorage'
import { defineEventHandler, getRouterParam, createError, setResponseHeaders } from 'h3'

export default defineEventHandler(async (event) => {
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

    try {
        const pdfBuffer = await getPdfFromStorage(filePath)

        if (!pdfBuffer) {
            throw createError({
                status: 404,
                statusText: 'PDF file not found'
            })
        }

        const filename = filePath.split('/').pop() || 'document.pdf'

        setResponseHeaders(event, {
            'Content-Type': 'application/pdf',
            'Content-Disposition': `inline; filename="${filename}"`,
            'Cache-Control': 'private, no-cache, no-store, must-revalidate',
            'Expires': '0',
            'Pragma': 'no-cache'
        })

        return pdfBuffer
    } catch (error: any) {
        if (error?.statusCode) {
            throw error
        }

        throw createError({
            status: 500,
            statusText: 'Error retrieving PDF file'
        }) as any
    }
})