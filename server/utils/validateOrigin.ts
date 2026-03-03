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

    // #region agent log
    fetch('http://127.0.0.1:7243/ingest/40d307ea-752f-424c-a179-ca112dd9b564', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': 'eb4175' },
        body: JSON.stringify({
            sessionId: 'eb4175',
            id: `log_${Date.now()}_validateOrigin_entry`,
            timestamp: Date.now(),
            runId: 'pre-fix',
            hypothesisId: 'H1',
            location: 'server/utils/validateOrigin.ts:21',
            message: 'validateOrigin entry',
            data: {
                host: headers?.host,
                origin,
                referer,
                allowedOrigins,
                nodeEnv: process.env.NODE_ENV
            }
        })
    }).catch(() => { })
    // #endregion agent log

    if (process.env.NODE_ENV === 'development') {
        const forwardedHost = headers?.['x-forwarded-host']
        const forwardedProto = headers?.['x-forwarded-proto']
        const host = headers?.host

        // Allow any localhost/127.0.0.1 request in development
        if (host && (host.includes('localhost') || host.includes('127.0.0.1'))) {
            return
        }

        // Allow requests with forwarded localhost headers
        if (forwardedHost && (forwardedHost.includes('localhost') || forwardedHost.includes('127.0.0.1'))) {
            return
        }

        // Allow requests with localhost origin or referer
        if (origin && (origin.includes('localhost') || origin.includes('127.0.0.1'))) {
            return
        }

        if (referer && (referer.includes('localhost') || referer.includes('127.0.0.1'))) {
            return
        }

        if (!origin && forwardedHost) {
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
        // #region agent log
        fetch('http://127.0.0.1:7243/ingest/40d307ea-752f-424c-a179-ca112dd9b564', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': 'eb4175' },
            body: JSON.stringify({
                sessionId: 'eb4175',
                id: `log_${Date.now()}_validateOrigin_no_request_origin`,
                timestamp: Date.now(),
                runId: 'pre-fix',
                hypothesisId: 'H1',
                location: 'server/utils/validateOrigin.ts:90',
                message: 'validateOrigin missing requestOrigin',
                data: {
                    origin,
                    referer,
                    allowedOrigins
                }
            })
        }).catch(() => { })
        // #endregion agent log

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
        // #region agent log
        fetch('http://127.0.0.1:7243/ingest/40d307ea-752f-424c-a179-ca112dd9b564', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': 'eb4175' },
            body: JSON.stringify({
                sessionId: 'eb4175',
                id: `log_${Date.now()}_validateOrigin_not_allowed`,
                timestamp: Date.now(),
                runId: 'pre-fix',
                hypothesisId: 'H1',
                location: 'server/utils/validateOrigin.ts:103',
                message: 'validateOrigin origin not allowed',
                data: {
                    requestOrigin,
                    normalizedRequestOrigin,
                    allowedOrigins
                }
            })
        }).catch(() => { })
        // #endregion agent log

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