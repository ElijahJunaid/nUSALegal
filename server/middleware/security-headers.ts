import { defineEventHandler } from 'h3'
import { dError } from '../utils/debug'

export default defineEventHandler(event => {
  try {
    const headers = event.node?.res?.getHeaders() || {}

    // Skip CSP headers in development mode to allow external resources
    const isDevelopment = process.env.NODE_ENV === 'development'

    if (!isDevelopment && !headers['content-security-policy']) {
      event.node?.res?.setHeader(
        'Content-Security-Policy',
        "script-src 'self' 'unsafe-inline' 'unsafe-eval' blob: https://p.trellocdn.com https://cdn.jsdelivr.net; connect-src 'self' blob: ws: wss: https://o4510700106416128.ingest.us.sentry.io https://www.nusa.gg https://api.nusa.gg https://users.roblox.com https://www.roblox.com https://ingesteer.services-prod.nsvcs.net https://cdn.jsdelivr.net https://*.basemaps.cartocdn.com https://main.realtime.ably.net https://main.fallback.ably-realtime.com https://main.a.fallback.ably-realtime.com https://main.c.fallback.ably-realtime.com https://rest.ably.io https://realtime.ably.io; worker-src 'self' blob:; default-src 'self'; style-src 'self' 'unsafe-inline' https://unpkg.com; img-src 'self' data: blob: https://unpkg.com https://*.tile.openstreetmap.org https://*.basemaps.cartocdn.com https://tr.rbxcdn.com https://www.roblox.com https://cdn.discordapp.com https://images.roblox.com; font-src 'self' data:; frame-src 'self' https: data:; frame-ancestors 'self'; base-uri 'self'; form-action 'self'"
      )
    }

    if (!headers['x-frame-options']) {
      event.node?.res?.setHeader('X-Frame-Options', 'SAMEORIGIN')
    }
  } catch (error) {
    dError('Security headers middleware error:', error)
  }
})
