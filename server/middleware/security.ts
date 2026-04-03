import { defineEventHandler, createError, type H3Event } from 'h3'
import { dLog, dError } from '../utils/debug'
import { secretManager } from '../utils/secret-manager'

export default defineEventHandler(async event => {
  dLog('🛡️ [SECURITY] Security middleware activated')

  // Add comprehensive security headers
  const res = event.node.res

  // Content Security Policy - Environment specific
  const isDevelopment = process.env.NODE_ENV === 'development'

  if (isDevelopment) {
    // Development CSP - allows external resources needed for UN pages
    res.setHeader(
      'Content-Security-Policy',
      "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' blob: https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline' https://unpkg.com; img-src 'self' data: blob: https://unpkg.com https://*.tile.openstreetmap.org https://*.basemaps.cartocdn.com; font-src 'self' data:; connect-src 'self' blob: ws: wss: https://cdn.jsdelivr.net https://*.basemaps.cartocdn.com https://main.realtime.ably.net https://main.fallback.ably-realtime.com https://main.a.fallback.ably-realtime.com https://main.c.fallback.ably-realtime.com https://rest.ably.io https://realtime.ably.io; worker-src 'self' blob:; frame-ancestors 'none';"
    )
  } else {
    // Production CSP - strict security with only essential external domains
    res.setHeader(
      'Content-Security-Policy',
      "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' blob: https://p.trellocdn.com https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline' https://unpkg.com; img-src 'self' data: blob: https://unpkg.com https://*.tile.openstreetmap.org https://*.basemaps.cartocdn.com; font-src 'self' data:; connect-src 'self' blob: ws: wss: https://o4510700106416128.ingest.us.sentry.io https://www.nusa.gg https://api.nusa.gg https://users.roblox.com https://www.roblox.com https://ingesteer.services-prod.nsvcs.net https://cdn.jsdelivr.net https://*.basemaps.cartocdn.com https://main.realtime.ably.net https://main.fallback.ably-realtime.com https://main.a.fallback.ably-realtime.com https://main.c.fallback.ably-realtime.com https://rest.ably.io https://realtime.ably.io; worker-src 'self' blob:; frame-ancestors 'none';"
    )
  }

  // Security headers
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.setHeader('X-Frame-Options', 'DENY')
  res.setHeader('X-XSS-Protection', '1; mode=block')
  // Special referrer policy for OSM tiles - allows OSM servers to see referrer
  res.setHeader('Referrer-Policy', 'no-referrer-when-downgrade')
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()')
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')

  // Allow external resources for UN pages
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin')
  res.setHeader('Cross-Origin-Embedder-Policy', 'unsafe-none')

  // Anti-tampering headers
  res.setHeader('X-Quiz-Security', 'enabled')
  res.setHeader('X-Content-Protection', 'active')

  // Cache control for dynamic content
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
  res.setHeader('Pragma', 'no-cache')
  res.setHeader('Expires', '0')

  // Remove server information
  res.setHeader('Server', 'SecureQuiz')
  res.setHeader('X-Powered-By', 'SecretManager')

  // Check for suspicious request patterns
  const userAgent = event.node.req.headers['user-agent'] || ''
  const clientIP = getClientIP(event)

  // Block common bot patterns
  const botPatterns = [
    /bot/i,
    /crawler/i,
    /spider/i,
    /scraper/i,
    /curl/i,
    /wget/i,
    /python/i,
    /java/i,
    /go-http/i,
    /node/i,
    /ruby/i,
    /php/i
  ]

  if (botPatterns.some(pattern => pattern.test(userAgent))) {
    dError(`❌ [SECURITY] Bot detected: ${userAgent} from ${clientIP}`)
    throw createError({
      status: 403,
      statusText: 'Access denied'
    })
  }

  // Check for suspicious headers
  const suspiciousHeaders = [
    'x-forwarded-for',
    'x-real-ip',
    'x-originating-ip',
    'x-remote-ip',
    'x-remote-addr'
  ]

  const headerCount = suspiciousHeaders.filter(header => event.node.req.headers[header]).length

  if (headerCount > 2) {
    dError(`❌ [SECURITY] Too many proxy headers detected from ${clientIP}`)
    throw createError({
      status: 403,
      statusText: 'Access denied'
    })
  }

  // Rate limiting by IP
  if (!secretManager.checkRateLimit('middleware', clientIP)) {
    dError(`❌ [SECURITY] Rate limit exceeded for ${clientIP}`)
    throw createError({
      status: 429,
      statusText: 'Too many requests'
    })
  }

  // Check request size
  const contentLength = parseInt(event.node.req.headers['content-length'] || '0')
  if (contentLength > 1024 * 1024) {
    // 1MB limit
    dError(`❌ [SECURITY] Request too large: ${contentLength} bytes from ${clientIP}`)
    throw createError({
      status: 413,
      statusText: 'Request too large'
    })
  }

  // Validate request method
  const allowedMethods = ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
  if (!allowedMethods.includes(event.node.req.method || '')) {
    dError(`❌ [SECURITY] Invalid method: ${event.node.req.method} from ${clientIP}`)
    throw createError({
      status: 405,
      statusText: 'Method not allowed'
    })
  }

  dLog(` [SECURITY] Request validated for ${clientIP}`)
})

function getClientIP(event: H3Event): string {
  return (event.node.req.headers['x-forwarded-for'] ||
    event.node.req.headers['x-real-ip'] ||
    event.node.req.connection?.remoteAddress ||
    event.node.req.socket?.remoteAddress ||
    'unknown') as string
}
