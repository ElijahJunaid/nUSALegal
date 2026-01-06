

export function sanitizeInput(input: string): string {
  if (typeof input !== 'string') return ''
  
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\
}

export function sanitizeObject<T extends Record<string, any>>(obj: T): T {
  if (!obj || typeof obj !== 'object') return obj
  
  const sanitized = {} as T
  
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      sanitized[key as keyof T] = sanitizeInput(value) as T[keyof T]
    } else if (Array.isArray(value)) {
      sanitized[key as keyof T] = value.map(item => 
        typeof item === 'string' ? sanitizeInput(item) : 
        typeof item === 'object' ? sanitizeObject(item) : 
        item
      ) as T[keyof T]
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key as keyof T] = sanitizeObject(value) as T[keyof T]
    } else {
      sanitized[key as keyof T] = value
    }
  }
  
  return sanitized
}

export function stripHtml(input: string): string {
  if (typeof input !== 'string') return ''
  
  return input.replace(/<[^>]*>/g, '')
}

export function sanitizeUrl(input: string): string {
  if (typeof input !== 'string') return ''
  
  return encodeURIComponent(input)
}

export function sanitizeEmail(email: string): string | null {
  if (typeof email !== 'string') return null
  
  const trimmed = email.trim().toLowerCase()
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  
  if (!emailRegex.test(trimmed)) return null
  
  return trimmed
}

export function isAlphanumeric(input: string, allowedChars: string = ''): boolean {
  if (typeof input !== 'string') return false
  
  const pattern = new RegExp(`^[a-zA-Z0-9${allowedChars.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}]+$`)
  return pattern.test(input)
}

export function truncate(input: string, maxLength: number): string {
  if (typeof input !== 'string') return ''
  if (input.length <= maxLength) return input
  
  return input.substring(0, maxLength)
}
