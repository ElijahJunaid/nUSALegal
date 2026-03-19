import DOMPurify from 'dompurify'
import type { Config } from 'dompurify'

const MARKDOWN_CONFIG: Config = {
  ALLOWED_TAGS: [
    'p',
    'h1',
    'h2',
    'h3',
    'h4',
    'strong',
    'em',
    'a',
    'ul',
    'ol',
    'li',
    'br',
    'span',
    'sup',
    'sub',
    'code',
    'pre',
    'blockquote',
    'hr',
    'table',
    'thead',
    'tbody',
    'tr',
    'th',
    'td'
  ],
  ALLOWED_ATTR: ['href', 'target', 'rel', 'class', 'title']
}

const EXCERPT_CONFIG: Config = {
  ALLOWED_TAGS: ['strong', 'em', 'span', 'br'],
  ALLOWED_ATTR: ['class']
}

export const useSanitize = () => {
  const sanitizeHtml = (html: string, config: Config = MARKDOWN_CONFIG): string => {
    if (import.meta.server) return html
    return DOMPurify.sanitize(html, config)
  }

  const sanitizeExcerpt = (html: string): string => sanitizeHtml(html, EXCERPT_CONFIG)

  return { sanitizeHtml, sanitizeExcerpt }
}
