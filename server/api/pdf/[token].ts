import { validatePdfToken } from '../../utils/pdfTokens'
import { getPdfFromStorage } from '../../utils/pdfStorage'

export default defineEventHandler(async (event) => {
    const token = getRouterParam(event, 'token')

    if (!token) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Token is required'
        })
    }

    // Validar token e obter filePath
    const filePath = validatePdfToken(token)

    if (!filePath) {
        throw createError({
            statusCode: 403,
            statusMessage: 'Invalid or expired token'
        })
    }

    // Segurança: prevenir path traversal
    if (filePath.includes('..') || filePath.includes('~')) {
        throw createError({
            statusCode: 403,
            statusMessage: 'Invalid file path'
        })
    }

    try {
        // Buscar PDF do storage configurado (S3 ou sistema de arquivos local)
        const pdfBuffer = await getPdfFromStorage(filePath)

        if (!pdfBuffer) {
            throw createError({
                statusCode: 404,
                statusMessage: 'PDF file not found'
            })
        }

        const filename = filePath.split('/').pop() || 'document.pdf'

        // Configurar headers para servir o PDF
        setResponseHeaders(event, {
            'Content-Type': 'application/pdf',
            'Content-Disposition': `inline; filename="${filename}"`,
            'Cache-Control': 'private, no-cache, no-store, must-revalidate',
            'Expires': '0',
            'Pragma': 'no-cache'
        })

        return pdfBuffer
    } catch (error: any) {
        // Se já é um createError, re-throw
        if (error?.statusCode) {
            throw error
        }

        throw createError({
            statusCode: 500,
            statusMessage: 'Error retrieving PDF file',
            data: {
                filePath,
                error: error?.message
            }
        })
    }
})
