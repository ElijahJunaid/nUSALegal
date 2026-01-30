import type { H3Event } from 'h3'
import { getHeader, setResponseHeader, createError } from 'h3'

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

    const headers = event.node?.req?.headers
    let origin = headers?.origin
    const referer = headers?.referer

    if (!origin && process.env.NODE_ENV === 'development') {
        const forwardedHost = headers?.['x-forwarded-host']
        const forwardedProto = headers?.['x-forwarded-proto']
        if (forwardedHost) {
            origin = `${forwardedProto || 'http'}://${forwardedHost}`
        }
    }

    if (allowedOrigins.length === 0) {

        if (origin) {
            const host = headers?.host
            const originUrl = new URL(origin)
            const requestHost = originUrl.host

            if (requestHost !== host) {
                throw createError({
                    status: 403,
                    statusText: 'Cross-origin requests not allowed'
                })
            }
        }
        return
    }

    if (allowedOrigins.includes('*')) {
        return
    }

    const requestOrigin = origin || (referer ? new URL(referer).origin : null)

    if (!requestOrigin && allowedOrigins.length > 0) {
        const host = headers?.host
        if (host && allowedOrigins.some(allowed => {
            const normalizedAllowed = allowed.replace(/\/$/, '')
            return host === new URL(normalizedAllowed).host
        })) {
            return
        }
    }

    if (!requestOrigin) {
        throw createError({
            status: 403,
            statusText: 'Origin header required'
        })
    }

    const normalizedRequestOrigin = requestOrigin.replace(/\/$/, '')
    const isAllowed = allowedOrigins.some(allowed => {
        const normalizedAllowed = allowed.replace(/\/$/, '')
        return normalizedRequestOrigin === normalizedAllowed
    })

    if (!isAllowed) {
        throw createError({
            status: 403,
            statusText: `Request not allowed`
        })
    }
}

export function setCorsHeaders(event: H3Event) {
    const allowedOrigins = getAllowedOrigins()
    const headers = event.node?.req?.headers
    const origin = headers?.origin

    if (allowedOrigins.includes('*')) {
        event.node?.res?.setHeader('Access-Control-Allow-Origin', '*')
        return
    }

    if (origin) {
        const normalizedOrigin = origin.replace(/\/$/, '')
        const isAllowed = allowedOrigins.some(allowed => {
            const normalizedAllowed = allowed.replace(/\/$/, '')
            return normalizedOrigin === normalizedAllowed
        })

        if (isAllowed) {
            event.node?.res?.setHeader('Access-Control-Allow-Origin', origin)
            event.node?.res?.setHeader('Access-Control-Allow-Credentials', 'true')
        }
    }
}