import { defaultRateLimiter, strictRateLimiter } from '../utils/rateLimit';

export default defineEventHandler(async (event) => {
  const url = getRequestURL(event);
  const path = url.pathname;

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
});