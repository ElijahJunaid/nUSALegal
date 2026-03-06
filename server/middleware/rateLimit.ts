import { defaultRateLimiter, strictRateLimiter } from '../utils/rateLimit'
import { eventHandler, getRequestURL, getHeader } from 'h3'

export default eventHandler(async event => {
  try {
    let url
    try {
      url = getRequestURL(event)
    } catch (urlError) {
      url = { pathname: event.node?.req?.url || '/' }
    }

    const path = url?.pathname || event.node?.req?.url || '/'

    const skipPaths = ['/api/health', '/_nuxt', '/favicon.ico', '/robots.txt']

    if (skipPaths.some(skipPath => path.startsWith(skipPath))) {
      return
    }

    if (path.startsWith('/api/auth') || path.includes('/token')) {
      // #region agent log
      fetch('http://127.0.0.1:7243/ingest/40d307ea-752f-424c-a179-ca112dd9b564', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': 'eb4175' },
        body: JSON.stringify({
          sessionId: 'eb4175',
          id: `log_${Date.now()}_ratelimit_before_strict`,
          timestamp: Date.now(),
          runId: 'pre-fix',
          hypothesisId: 'H1',
          location: 'server/middleware/rateLimit.ts:27',
          message: 'rate limit before strictRateLimiter for /api/auth',
          data: { path, hasNode: !!event.node, hasReq: !!event.node?.req }
        })
      }).catch(() => {})
      // #endregion agent log
      await strictRateLimiter.middleware()(event)
      // #region agent log
      fetch('http://127.0.0.1:7243/ingest/40d307ea-752f-424c-a179-ca112dd9b564', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': 'eb4175' },
        body: JSON.stringify({
          sessionId: 'eb4175',
          id: `log_${Date.now()}_ratelimit_after_strict`,
          timestamp: Date.now(),
          runId: 'pre-fix',
          hypothesisId: 'H1',
          location: 'server/middleware/rateLimit.ts:42',
          message: 'rate limit after strictRateLimiter (passed)',
          data: {}
        })
      }).catch(() => {})
      // #endregion agent log
      return
    }
    if (path.startsWith('/api')) {
      await defaultRateLimiter.middleware()(event)
      return
    }
  } catch (error: any) {
    console.error('Rate limiting middleware error:', error)
    // Debug mode: return error in response when X-Debug: 1
    if (getHeader(event, 'x-debug') === '1' && event.node?.res) {
      event.node.res.setHeader('Content-Type', 'application/json')
      event.node.res.statusCode = 200
      event.node.res.end(
        JSON.stringify({
          _debug: true,
          from: 'rateLimit',
          error: error?.message,
          name: error?.name,
          stack: error?.stack?.split?.('\n')?.slice?.(0, 15)
        })
      )
      return
    }
    throw error
  }
})
