interface AuthTokenRequestBody {
  endpoint: string
}

import { defineEventHandler, readBody, createError } from 'h3'
import { validateOrigin, setCorsHeaders } from '../../utils/validateOrigin'
import { generateApiToken } from '../../utils/apiTokens'

export default defineEventHandler(async (event) => {
    
    validateOrigin(event)

    setCorsHeaders(event)

    let body: AuthTokenRequestBody
    
    // Debug: Log the raw request details
    console.log('=== Auth Token Request Debug ===')
    console.log('Headers:', event.node?.req?.headers)
    console.log('Method:', event.node?.req?.method)
    console.log('URL:', event.node?.req?.url)
    
    try {
        body = await readBody(event) as AuthTokenRequestBody
        console.log('Parsed body:', body)
    } catch (error: any) {
        console.log('readBody failed, trying fallback:', error.message)
        try {
            const req = event.node?.req as any
            console.log('Request object:', req)
            console.log('Request body:', req?.body)
            console.log('Request headers:', req?.headers)
            
            if (req && req.body) {
                if (typeof req.body === 'string') {
                    body = JSON.parse(req.body) as AuthTokenRequestBody
                } else if (req.body instanceof Buffer) {
                    body = JSON.parse(req.body.toString()) as AuthTokenRequestBody
                } else {
                    body = req.body as AuthTokenRequestBody
                }
            } else {
                const chunks = []
                for await (const chunk of req) {
                    chunks.push(chunk)
                }
                const rawBody = Buffer.concat(chunks).toString()
                console.log('Stream body:', rawBody)
                body = JSON.parse(rawBody) as AuthTokenRequestBody
            }
        } catch (parseError) {
            console.log('All parsing methods failed:', parseError)
            throw createError({
                status: 400,
                statusText: 'Invalid JSON in request body'
            })
        }
    }
    
    const { endpoint } = body

    if (!endpoint) {
        throw createError({
            status: 400,
            statusText: 'Endpoint is required'
        })
    }

    const allowedEndpoints = [
        'bills/congress',
        'bills/city-council',
        'courts/2',
        'courts/3',
        'courts/4',
        'courts/5',
        'courts/6',
        'courts/7',
        'courts/8',
        'courts/9',
        'courts/10',
        'courts/11',
        'courts/12',
        'courts/13',
        'courts/14',
        'courts/15',
        'courts/16',
        'courts/17',
        'federal-rules/frcp',
        'federal-rules/frcmp',
        'laws/federal',
        'laws/eo',
        'laws/municipal',
        'constitution/constitution',
        'constitution/constitution-amandments',
        'constitution/articles',
        'resources/definitions',
        'resources/files',
        'resources/court-procedure',
        'resources/office',
        'resources/vips',
    ]

    if (!allowedEndpoints.includes(endpoint)) {
        throw createError({
            status: 400,
            statusText: 'Invalid endpoint'
        })
    }

    const token = generateApiToken(endpoint)

    return {
        token,
        expiresIn: '5 minutes'
    }
})