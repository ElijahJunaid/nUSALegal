interface AuthTokenRequestBody {
    endpoint: string
}

import { defineEventHandler, readBody, readRawBody, createError, getHeader } from 'h3'
import { validateOrigin, setCorsHeaders } from '../../utils/validateOrigin'
import { generateApiToken } from '../../utils/apiTokens'

export default defineEventHandler(async (event) => {
    try {
        // #region agent log
        {
            const headers = event.node?.req?.headers
            const req = event.node?.req as any
            fetch('http://127.0.0.1:7243/ingest/40d307ea-752f-424c-a179-ca112dd9b564', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': 'eb4175' },
                body: JSON.stringify({
                    sessionId: 'eb4175',
                    id: `log_${Date.now()}_auth_token_entry`,
                    timestamp: Date.now(),
                    runId: 'pre-fix',
                    hypothesisId: 'H1',
                    location: 'server/api/auth/token.post.ts:14',
                    message: 'auth token handler entry',
                    data: {
                        url: event.node?.req?.url,
                        method: event.node?.req?.method,
                        host: headers?.host,
                        origin: headers?.origin,
                        referer: headers?.referer,
                        nodeEnv: process.env.NODE_ENV,
                        hasNode: !!event.node,
                        hasReq: !!req,
                        bodyType: req?.body != null ? typeof req.body : 'undefined',
                        hasGetReader: typeof req?.body?.getReader === 'function',
                    }
                })
            }).catch(() => { })
        }
        // #endregion agent log

        validateOrigin(event)
        
        setCorsHeaders(event)

        // #region agent log
        fetch('http://127.0.0.1:7243/ingest/40d307ea-752f-424c-a179-ca112dd9b564', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': 'eb4175' },
            body: JSON.stringify({
                sessionId: 'eb4175',
                id: `log_${Date.now()}_auth_token_after_origin`,
                timestamp: Date.now(),
                runId: 'pre-fix',
                hypothesisId: 'H1',
                location: 'server/api/auth/token.post.ts:27',
                message: 'auth token after origin validation and CORS',
                data: {}
            })
        }).catch(() => { })
        // #endregion agent log

        let body: AuthTokenRequestBody

        console.log('=== Auth Token Request Debug ===')
        console.log('Headers:', event.node?.req?.headers)
        console.log('Method:', event.node?.req?.method)
        console.log('URL:', event.node?.req?.url)

        try {
            console.log('Attempting to read body directly...')
            const req = event.node?.req as any

            let parsedBody: any = undefined;
            let rawStr = '';

            // Method 0: readRawBody (works in Netlify/serverless when readBody fails)
            try {
                const raw = await readRawBody(event);
                if (raw && typeof raw === 'string') {
                    rawStr = raw;
                    parsedBody = JSON.parse(raw);
                }
            } catch (_e0) {
                // #region agent log
                fetch('http://127.0.0.1:7243/ingest/40d307ea-752f-424c-a179-ca112dd9b564', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': 'eb4175' },
                    body: JSON.stringify({
                        sessionId: 'eb4175',
                        id: `log_${Date.now()}_readRawBody_failed`,
                        timestamp: Date.now(),
                        runId: 'pre-fix',
                        hypothesisId: 'H3',
                        location: 'server/api/auth/token.post.ts:78',
                        message: 'readRawBody failed',
                        data: { err: String((_e0 as Error)?.message) }
                    })
                }).catch(() => { })
                // #endregion agent log
            }

            // Method 1: Standard readBody() attempt (if raw not yet available)
            if (!parsedBody) {
                try {
                    if (process.env.NODE_ENV !== 'production' || !(req?.body && typeof req.body.getReader === 'function')) {
                        const standardBody = await readBody(event);
                        if (standardBody && Object.keys(standardBody).length > 0) {
                            parsedBody = standardBody;
                        }
                    }
                } catch (e) {
                    console.log('readBody failed, moving to fallback');
                }
            }

            if (!parsedBody && !rawStr) {
                // Method 2: Direct body access (string, Buffer, object)
                if (req && req.body) {
                    if (typeof req.body === 'object' && !Buffer.isBuffer(req.body) && typeof req.body.getReader !== 'function') {
                        parsedBody = req.body;
                    } else if (typeof req.body === 'string') {
                        rawStr = req.body;
                    } else if (Buffer.isBuffer(req.body)) {
                        rawStr = req.body.toString();
                    }
                }

                // Method 3: Stream reading with chunk concatenation
                if (!rawStr && !parsedBody) {
                    if (process.env.NODE_ENV === 'production' && req && req.body && typeof req.body.getReader === 'function') {
                        const reader = req.body.getReader();
                        const decoder = new TextDecoder();
                        while (true) {
                            const { done, value } = await reader.read();
                            if (done) break;
                            rawStr += decoder.decode(value, { stream: true });
                        }
                    } else if (req) {
                        try {
                            const chunks = [];
                            for await (const chunk of req) {
                                chunks.push(chunk);
                            }
                            rawStr = Buffer.concat(chunks).toString();
                        } catch (e) { }
                    }
                }

                if (!parsedBody && rawStr) {
                    try {
                        parsedBody = JSON.parse(rawStr);
                    } catch (e) {
                        console.log('JSON parse failed, applying resilience checks');

                        // Method 4: Data cleaning (remove control characters)
                        const cleanedStr = rawStr.replace(/[\x00-\x1F\x7F]/g, "").trim();
                        try {
                            if (cleanedStr) {
                                parsedBody = JSON.parse(cleanedStr);
                            }
                        } catch (e2) {
                            // Method 5: JSON extraction
                            const jsonMatch = cleanedStr.match(/\{.*?\}/);
                            if (jsonMatch) {
                                try {
                                    parsedBody = JSON.parse(jsonMatch[0]);
                                } catch (e3) { }
                            }

                            if (!parsedBody) {
                                // Method 6: Multiple regex patterns
                                const endpointRegex1 = /"endpoint"\s*:\s*"([^"\s}]+)"/i;
                                const match1 = cleanedStr.match(endpointRegex1);
                                if (match1 && match1[1]) {
                                    parsedBody = { endpoint: match1[1] };
                                } else {
                                    const endpointRegex2 = /endpoint['"]?\s*[:=]\s*['"]?([^'"\s}]+)/i;
                                    const match2 = cleanedStr.match(endpointRegex2);
                                    if (match2 && match2[1]) {
                                        parsedBody = { endpoint: match2[1] };
                                    }
                                }
                            }

                            if (!parsedBody) {
                                // Method 7: Bills-specific pattern matching
                                if (cleanedStr.includes('congress')) {
                                    parsedBody = { endpoint: 'bills/congress' };
                                } else if (cleanedStr.includes('city-council')) {
                                    parsedBody = { endpoint: 'bills/city-council' };
                                } else if (cleanedStr.includes('district-court')) {
                                    parsedBody = { endpoint: 'district-court' };
                                } else if (cleanedStr.includes('courts/')) {
                                    const courtMatch = cleanedStr.match(/courts\/\d+/);
                                    if (courtMatch) {
                                        parsedBody = { endpoint: courtMatch[0] };
                                    }
                                }
                            }
                        }
                    }
                }

                if (!parsedBody) {
                    // Method 8: Default fallback
                    if (process.env.NODE_ENV === 'development') {
                        console.log('All methods failed, using development default fallback');
                        parsedBody = { endpoint: 'bills/congress' };
                    } else {
                        throw new Error('No body available for parsing');
                    }
                }
            }

            body = parsedBody as AuthTokenRequestBody;
            console.log('Final parsed body:', body)
            console.log('Body type:', typeof body)
            console.log('Body has endpoint:', body?.endpoint)

        } catch (error: any) {
            console.log('All parsing methods failed:', error.message)
            console.log('Error stack:', error.stack)

            // #region agent log
            fetch('http://127.0.0.1:7243/ingest/40d307ea-752f-424c-a179-ca112dd9b564', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': 'eb4175' },
                body: JSON.stringify({
                    sessionId: 'eb4175',
                    id: `log_${Date.now()}_auth_token_body_parse_error`,
                    timestamp: Date.now(),
                    runId: 'pre-fix',
                    hypothesisId: 'H2',
                    location: 'server/api/auth/token.post.ts:145',
                    message: 'auth token body parsing failed',
                    data: {
                        errorMessage: error?.message,
                        errorName: error?.name
                    }
                })
            }).catch(() => { })
            // #endregion agent log

            throw createError({
                status: 400,
                statusText: 'Invalid JSON in request body'
            })
        }

        const { endpoint } = body

        if (!endpoint) {
            // #region agent log
            fetch('http://127.0.0.1:7243/ingest/40d307ea-752f-424c-a179-ca112dd9b564', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': 'eb4175' },
                body: JSON.stringify({
                    sessionId: 'eb4175',
                    id: `log_${Date.now()}_auth_token_no_endpoint`,
                    timestamp: Date.now(),
                    runId: 'pre-fix',
                    hypothesisId: 'H2',
                    location: 'server/api/auth/token.post.ts:156',
                    message: 'auth token missing endpoint in body',
                    data: {}
                })
            }).catch(() => { })
            // #endregion agent log

            throw createError({
                status: 400,
                statusText: 'Endpoint is required'
            })
        }

        const allowedEndpoints = [
            'global-search',
            'bills/congress',
            'bills/city-council',
            'district-court',
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
            // #region agent log
            fetch('http://127.0.0.1:7243/ingest/40d307ea-752f-424c-a179-ca112dd9b564', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': 'eb4175' },
                body: JSON.stringify({
                    sessionId: 'eb4175',
                    id: `log_${Date.now()}_auth_token_invalid_endpoint`,
                    timestamp: Date.now(),
                    runId: 'pre-fix',
                    hypothesisId: 'H3',
                    location: 'server/api/auth/token.post.ts:198',
                    message: 'auth token invalid endpoint',
                    data: { endpoint }
                })
            }).catch(() => { })
            // #endregion agent log

            throw createError({
                status: 400,
                statusText: 'Invalid endpoint'
            })
        }

        const token = generateApiToken(endpoint)

        // #region agent log
        fetch('http://127.0.0.1:7243/ingest/40d307ea-752f-424c-a179-ca112dd9b564', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': 'eb4175' },
            body: JSON.stringify({
                sessionId: 'eb4175',
                id: `log_${Date.now()}_auth_token_success`,
                timestamp: Date.now(),
                runId: 'pre-fix',
                hypothesisId: 'H3',
                location: 'server/api/auth/token.post.ts:205',
                message: 'auth token generated successfully',
                data: { endpoint }
            })
        }).catch(() => { })
        // #endregion agent log

        return {
            token,
            expiresIn: '5 minutes'
        }
    } catch (err: any) {
        console.error('AUTH_TOKEN_UNHANDLED_ERROR', {
            message: err?.message,
            name: err?.name,
            stack: err?.stack,
        })
        // Debug mode: return error in response body when X-Debug: 1
        if (getHeader(event, 'x-debug') === '1') {
            return {
                _debug: true,
                error: err?.message,
                name: err?.name,
                stack: err?.stack?.split?.('\n')?.slice?.(0, 15),
            }
        }
        throw err
    }
})
