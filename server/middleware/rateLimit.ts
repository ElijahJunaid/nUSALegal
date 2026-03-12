import { defaultRateLimiter, strictRateLimiter } from '../utils/rateLimit'
import { defineEventHandler, getRequestURL, getHeader } from 'h3'

export default defineEventHandler(async event => {
  try {
    let url
    try {
      url = getRequestURL(event)
    } catch {
      url = { pathname: event.node?.req?.url || '/' }
    }

    const path = url?.pathname || event.node?.req?.url || '/'

    const skipPaths = ['/api/health', '/_nuxt', '/favicon.ico', '/robots.txt']

    if (skipPaths.some(skipPath => path.startsWith(skipPath))) {
      return
    }

    if (path.startsWith('/api/auth') || path.includes('/token')) {
      await strictRateLimiter.middleware()(event)
      return
    }
    if (path.startsWith('/api')) {
      await defaultRateLimiter.middleware()(event)
      return
    }
  } catch (error: unknown) {
    console.error('Rate limiting middleware error:', error)
    if (getHeader(event, 'x-debug') === '1' && event.node?.res) {
      const e = error instanceof Error ? error : null
      event.node.res.setHeader('Content-Type', 'application/json')
      event.node.res.statusCode = 200
      event.node.res.end(
        JSON.stringify({
          _debug: true,
          from: 'rateLimit',
          error: e?.message,
          name: e?.name,
          stack: e?.stack?.split?.('\n')?.slice?.(0, 15)
        })
      )
      return
    }
    throw error
  }
})
