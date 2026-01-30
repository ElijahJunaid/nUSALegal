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
        console.log('PDF API: Attempting to read body directly...')
        const req = event.node?.req as any
        console.log('PDF API: Request object exists:', !!req)
        console.log('PDF API: Request body type:', typeof req?.body)
        console.log('PDF API: Request body:', req?.body)
        
        body = undefined
        
        if (process.env.NODE_ENV === 'production') {
            console.log('PDF API: Production environment, using Netlify functions parsing...')
            
            if (req && req.body && typeof req.body.getReader === 'function') {
                console.log('PDF API: Detected Netlify ReadableStream, reading manually...')
                const reader = req.body.getReader()
                const decoder = new TextDecoder()
                let result = ''
                
                while (true) {
                    const { done, value } = await reader.read()
                    if (done) break
                    result += decoder.decode(value, { stream: true })
                }
                
                console.log('PDF API: Stream result:', result)
                body = JSON.parse(result) as PdfTokenRequestBody
            } else if (req && req.body) {
                console.log('PDF API: Direct body access in production...')
                if (typeof req.body === 'string') {
                    body = JSON.parse(req.body) as PdfTokenRequestBody
                } else if (req.body instanceof Buffer) {
                    body = JSON.parse(req.body.toString()) as PdfTokenRequestBody
                } else {
                    const bodyStr = JSON.stringify(req.body)
                    body = JSON.parse(bodyStr) as PdfTokenRequestBody
                }
            } else {
                throw new Error('No valid body found in Netlify functions')
            }
        }
        
        else {
            console.log('PDF API: Local development, trying readBody...')
            try {
                body = await readBody(event) as PdfTokenRequestBody
                console.log('PDF API: readBody succeeded:', body)
            } catch (readBodyError) {
                console.log('PDF API: readBody failed, using fallback:', readBodyError.message)
                
                if (req && req.body) {
                    if (typeof req.body === 'string') {
                        body = JSON.parse(req.body) as PdfTokenRequestBody
                    } else if (req.body instanceof Buffer) {
                        body = JSON.parse(req.body.toString()) as PdfTokenRequestBody
                    } else {
                        body = req.body as PdfTokenRequestBody
                    }
                } else {
                    const chunks = []
                    for await (const chunk of req) {
                        chunks.push(chunk)
                    }
                    const rawBody = Buffer.concat(chunks).toString()
                    console.log('PDF API: Stream body:', rawBody)
                    body = JSON.parse(rawBody) as PdfTokenRequestBody
                }
            }
        }
        
        console.log('PDF API: Final parsed body:', body)
        console.log('PDF API: Body type:', typeof body)
        console.log('PDF API: Body has pdfPath:', body?.pdfPath)
        
    } catch (error: any) {
        console.log('PDF API: All parsing methods failed:', error.message)
        console.log('PDF API: Error stack:', error.stack)
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