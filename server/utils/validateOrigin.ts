import type { H3Event } from 'h3'

function getAllowedOrigins(): string[] {
    const originsEnv = process.env.ALLOWED_ORIGINS || ''

    if (!originsEnv.trim()) {
        return []
    }

    if (originsEnv.trim() === '*') {
        return ['*']
    }

    return originsEnv
        .split(',')
        .map(origin => origin.trim())
        .filter(origin => origin.length > 0)
}

export function validateOrigin(event: H3Event) {
    const allowedOrigins = getAllowedOrigins()

    const origin = getHeader(event, 'origin')
    const referer = getHeader(event, 'referer')

    if (allowedOrigins.length === 0) {

        if (origin) {
            const host = getHeader(event, 'host')
            const originUrl = new URL(origin)
            const requestHost = originUrl.host

            if (requestHost !== host) {
                throw createError({
                    statusCode: 403,
                    statusMessage: 'Cross-origin requests not allowed'
                })
            }
        }
        return
    }

    if (allowedOrigins.includes('*')) {
        return
    }

    const requestOrigin = origin || (referer ? new URL(referer).origin : null)

    if (!requestOrigin) {
        throw createError({
            statusCode: 403,
            statusMessage: 'Origin header required'
        })
    }

    const normalizedRequestOrigin = requestOrigin.replace(/\/$/, '')
    const isAllowed = allowedOrigins.some(allowed => {
        const normalizedAllowed = allowed.replace(/\/$/, '')
        return normalizedRequestOrigin === normalizedAllowed
    })

    if (!isAllowed) {
        throw createError({
            statusCode: 403,
            statusMessage: `Request not allowed`
        })
    }
}

export function setCorsHeaders(event: H3Event) {
    const allowedOrigins = getAllowedOrigins()
    const origin = getHeader(event, 'origin')

    if (allowedOrigins.includes('*')) {
        setResponseHeader(event, 'Access-Control-Allow-Origin', '*')
        return
    }

    if (origin) {
        const normalizedOrigin = origin.replace(/\/$/, '')
        const isAllowed = allowedOrigins.some(allowed => {
            const normalizedAllowed = allowed.replace(/\/$/, '')
            return normalizedOrigin === normalizedAllowed
        })

        if (isAllowed) {
            setResponseHeader(event, 'Access-Control-Allow-Origin', origin)
            setResponseHeader(event, 'Access-Control-Allow-Credentials', 'true')
        }
    }
}
