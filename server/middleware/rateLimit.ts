import { defaultRateLimiter, strictRateLimiter } from '../utils/rateLimit';
import { eventHandler } from 'h3';

export default eventHandler(async (event) => {
  try {
    const url = getRequestURL(event);
    const path = url?.pathname || event.node?.req?.url || '/';

    const skipPaths = [
      '/api/health',
      '/_nuxt',
      '/favicon.ico',
      '/robots.txt',
    ];

    if (skipPaths.some((skipPath) => path.startsWith(skipPath))) {
      return;
    }

    if (path.startsWith('/api/auth') || path.includes('/token')) {
      await strictRateLimiter.middleware()(event);
      return;
    }
    if (path.startsWith('/api')) {
      await defaultRateLimiter.middleware()(event);
      return;
    }
  } catch (error) {
    console.error('Rate limiting middleware error:', error);
  }
});