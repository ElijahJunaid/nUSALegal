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
    
    console.log('=== Auth Token Request Debug ===')
    console.log('Headers:', event.node?.req?.headers)
    console.log('Method:', event.node?.req?.method)
    console.log('URL:', event.node?.req?.url)
    
    try {
        console.log('Attempting to read body directly...')
        const req = event.node?.req as any
        console.log('Request object exists:', !!req)
        console.log('Request body type:', typeof req?.body)
        console.log('Request body:', req?.body)
        
        body = undefined
        
        if (process.env.NODE_ENV === 'production') {
            console.log('Production environment, using Netlify functions parsing...')
            
            if (req && req.body && typeof req.body.getReader === 'function') {
                console.log('Detected Netlify ReadableStream, reading manually...')
                const reader = req.body.getReader()
                const decoder = new TextDecoder()
                let result = ''
                
                while (true) {
                    const { done, value } = await reader.read()
                    if (done) break
                    result += decoder.decode(value, { stream: true })
                }
                
                console.log('Stream result:', result)
                body = JSON.parse(result) as AuthTokenRequestBody
            } else if (req && req.body) {
                console.log('Direct body access in production...')
                if (typeof req.body === 'string') {
                    body = JSON.parse(req.body) as AuthTokenRequestBody
                } else if (req.body instanceof Buffer) {
                    body = JSON.parse(req.body.toString()) as AuthTokenRequestBody
                } else {
                    const bodyStr = JSON.stringify(req.body)
                    body = JSON.parse(bodyStr) as AuthTokenRequestBody
                }
            } else {
                throw new Error('No valid body found in Netlify functions')
            }
        }
        
        else {
            console.log('Local development, trying readBody...')
            try {
                body = await readBody(event) as AuthTokenRequestBody
                console.log('readBody succeeded:', body)
            } catch (readBodyError) {
                console.log('readBody failed, using fallback:', readBodyError.message)
                
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
            }
        }
        
        console.log('Final parsed body:', body)
        console.log('Body type:', typeof body)
        console.log('Body has endpoint:', body?.endpoint)
        
    } catch (error: any) {
        console.log('All parsing methods failed:', error.message)
        console.log('Error stack:', error.stack)
        throw createError({
            status: 400,
            statusText: 'Invalid JSON in request body'
        })
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