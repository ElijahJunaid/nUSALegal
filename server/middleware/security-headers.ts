import { eventHandler } from 'h3';

export default eventHandler((event) => {
  try {
    const headers = event.node?.res?.getHeaders() || {};

    if (!headers['content-security-policy']) {
      event.node?.res?.setHeader(
        'Content-Security-Policy',
        "script-src 'self' 'unsafe-inline' 'unsafe-eval' blob: https://p.trellocdn.com; connect-src 'self' ws: wss: https://o4510700106416128.ingest.us.sentry.io https://www.nusa.gg https://api.nusa.gg https://users.roblox.com https://www.roblox.com; worker-src 'self' blob:; default-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; frame-src 'self' https: data:; frame-ancestors 'self'; base-uri 'self'; form-action 'self'"
      );
    }
    
    if (!headers['x-frame-options']) {
      event.node?.res?.setHeader('X-Frame-Options', 'SAMEORIGIN');
    }
  } catch (error) {
    console.error('Security headers middleware error:', error);
  }
});