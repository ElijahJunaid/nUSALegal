export default defineEventHandler(async (event) => {
    
    validateOrigin(event)

    setCorsHeaders(event)

    const body = await readBody(event)
    const { pdfPath } = body

    if (!pdfPath) {
        throw createError({
            statusCode: 400,
            statusMessage: 'PDF path is required'
        })
    }

    if (pdfPath.includes('..') || pdfPath.includes('~')) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Invalid PDF path'
        })
    }

    if (!pdfPath.startsWith('bills/') && !pdfPath.startsWith('dcbills/')) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Invalid PDF path'
        })
    }

    const token = generatePdfToken(pdfPath)

    return {
        token,
        url: `/api/pdf/${token}`
    }
})
