import { defineEventHandler } from 'h3'

const BLOCKED_EXTENSIONS = ['.html', '.htm', '.php', '.asp', '.aspx', '.jsp', '.cgi']
const BLOCKED_PREFIXES = [
  '/cgi/',
  '/cgi-bin/',
  '/.env',
  '/wp-',
  '/wordpress',
  '/admin',
  '/phpmyadmin'
]
const BLOCKED_FILES = [
  '/loginMsg.js',
  '/favicon.ico',
  '/robots.txt',
  '/sitemap.xml',
  '/xmlrpc.php',
  '/wp-login.php',
  '/wp-admin'
]

export default defineEventHandler(event => {
  const url = event.node.req.url || ''
  const path = url.split('?')[0]

  const isBlockedExt = BLOCKED_EXTENSIONS.some(ext => path.endsWith(ext))
  const isBlockedPrefix = BLOCKED_PREFIXES.some(p => path.startsWith(p))
  const isBlockedFile = BLOCKED_FILES.some(f => path === f || path.startsWith(f + '/'))

  if ((isBlockedExt && path.startsWith('/api/')) || isBlockedPrefix || isBlockedFile) {
    event.node.res.statusCode = 404
    event.node.res.end('')
  }
})
