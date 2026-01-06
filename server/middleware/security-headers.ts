export default defineEventHandler((event) => {
  const headers = event.node.res.getHeaders()

  if (!headers['content-security-policy']) {
    event.node.res.setHeader(
      'Content-Security-Policy',
      [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://p.trellocdn.com",
        "style-src 'self' 'unsafe-inline'",
        "img-src 'self' data: https:",
        "font-src 'self' data:",
        "connect-src 'self' ws: wss:",
        "frame-src 'self' https: data:",
        "frame-ancestors 'self'",
        "base-uri 'self'",
        "form-action 'self'"
      ].join('; ')
    )
  }
  
  if (!headers['x-frame-options']) {
    event.node.res.setHeader('X-Frame-Options', 'SAMEORIGIN')
  }
})