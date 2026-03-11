import { z } from 'zod'

/**
 * Comprehensive validation schemas and utilities for API endpoints
 * Enhanced security features with proper error handling and sanitization
 */

// Common validation patterns
const patterns = {
  endpoint: /^[a-zA-Z0-9/_-]+$/,
  path: /^[a-zA-Z0-9/_.-]+$/,
  alphanumeric: /^[a-zA-Z0-9]+$/,
  numeric: /^[0-9]+$/,
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  url: /^https?:\/\/.+/,
  threadId: /^thread_[a-zA-Z0-9]{24,}$/,
  vectorStoreId: /^vs_[a-zA-Z0-9]{24,}$/,
  objectId: /^[0-9a-fA-F]{24}$/,
  safeString: /^[^<>"'&]*$/,
  filename: /^[^\\/:*?"<>|]+$/,
  jsonKey: /^[a-zA-Z_$][a-zA-Z0-9_$]*$/
}

// Custom validators
const customValidators = {
  noPathTraversal: (value: string) => {
    const normalized = value.replace(/\\/g, '/')
    return !normalized.includes('..') && !normalized.includes('~')
  },

  noSqlInjection: (value: string) => {
    const sqlPatterns = [
      /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|SCRIPT)\b)/i,
      /(--|\/\*|\*\/|;|'|--|\bx27|\bOR\b|\bAND\b)/i,
      /\b(UNION|ALL|DISTINCT|WHERE|JOIN|GROUP BY|HAVING|ORDER BY|LIMIT)\b/i
    ]
    return !sqlPatterns.some(pattern => pattern.test(value))
  },

  noXss: (value: string) => {
    const xssPatterns = [
      /<script\b[^<]*(?:(?!<\/script>).*?<\/script>)/gi,
      /javascript:/gi,
      /on\w+\s*=/gi,
      /<iframe\b[^>]*>/gi,
      /<object\b[^>]*>/gi,
      /<embed\b[^>]*>/gi,
      /<link\b[^>]*>/gi,
      /<meta\b[^>]*>/gi
    ]
    return !xssPatterns.some(pattern => pattern.test(value))
  },

  allowedExtensions: (allowed: string[]) => (value: string) => {
    const ext = value.split('.').pop()?.toLowerCase()
    return ext && allowed.includes(ext)
  },

  inRange: (min: number, max: number) => (value: number) => value >= min && value <= max,

  lengthRange: (min: number, max: number) => (value: string) =>
    value.length >= min && value.length <= max
}

// Enhanced error messages
const errorMessages = {
  required: 'This field is required',
  invalidFormat: 'Invalid format provided',
  tooShort: 'Value is too short',
  tooLong: 'Value is too long',
  invalidChars: 'Contains invalid characters',
  forbidden: 'Contains forbidden content',
  invalidType: 'Invalid data type',
  outOfRange: 'Value is out of allowed range',
  pathTraversal: 'Path traversal not allowed',
  sqlInjection: 'Potential SQL injection detected',
  xssRisk: 'Potential XSS risk detected',
  invalidEndpoint: 'Invalid endpoint specified',
  invalidPath: 'Invalid path format',
  invalidEmail: 'Invalid email format',
  invalidUrl: 'Invalid URL format',
  invalidId: 'Invalid ID format',
  quotaExceeded: 'Request quota exceeded'
}

/**
 * Comprehensive validation schemas for API endpoints
 */
export const validationSchemas = {
  // Auth token endpoint validation
  authToken: z.object({
    endpoint: z.enum([
      'global-search',
      'bills/congress',
      'bills/city-council',
      'district-court',
      'courts/2',
      'courts/3',
      'courts/4',
      'courts/5',
      'courts/6',
      'courts/7',
      'courts/8',
      'courts/9',
      'courts/10',
      'courts/11',
      'courts/12',
      'courts/13',
      'courts/14',
      'courts/15',
      'courts/16',
      'courts/17',
      'federal-rules/frcp',
      'federal-rules/frcmp',
      'laws/federal',
      'laws/eo',
      'laws/municipal',
      'constitution/constitution',
      'constitution/constitution-amandements',
      'constitution/articles',
      'resources/definitions',
      'resources/files',
      'resources/court-procedure',
      'resources/office',
      'resources/vips'
    ])
  }),

  // PDF token endpoint validation with enhanced security
  pdfToken: z.object({
    pdfPath: z
      .string()
      .min(1, errorMessages.required)
      .max(500, errorMessages.tooLong)
      .regex(patterns.path, errorMessages.invalidChars)
      .refine(customValidators.noPathTraversal, {
        message: errorMessages.pathTraversal
      })
      .refine(path => path.startsWith('bills/') || path.startsWith('dcbills/'), {
        message: 'PDF path must start with bills/ or dcbills/'
      })
      .refine(customValidators.noSqlInjection, {
        message: errorMessages.sqlInjection
      })
      .refine(customValidators.noXss, {
        message: errorMessages.xssRisk
      })
  }),

  // Chatbot endpoint validation with comprehensive security
  chatbot: z.object({
    query: z
      .string()
      .max(5000, errorMessages.tooLong)
      .min(1, errorMessages.required)
      .refine(customValidators.noSqlInjection, {
        message: errorMessages.sqlInjection
      })
      .refine(customValidators.noXss, {
        message: errorMessages.xssRisk
      })
      .transform(val => val.trim().replace(/\s+/g, ' '))
      .optional(),
    thread_id: z.string().regex(patterns.threadId, errorMessages.invalidId).optional()
  }),

  // nUSA bans check validation with enhanced security
  checkNusaBans: z.object({
    userId: z
      .string()
      .regex(patterns.numeric, errorMessages.invalidFormat)
      .max(32, errorMessages.tooLong)
      .min(1, errorMessages.required)
      .refine(customValidators.noSqlInjection, {
        message: errorMessages.sqlInjection
      })
      .refine(customValidators.noXss, {
        message: errorMessages.xssRisk
      })
  }),

  // File upload validation
  fileUpload: z.object({
    filename: z
      .string()
      .max(255, errorMessages.tooLong)
      .regex(patterns.filename, errorMessages.invalidChars),
    mimeType: z.enum([
      'application/pdf',
      'image/jpeg',
      'image/png',
      'image/gif',
      'text/plain',
      'application/json'
    ]),
    size: z
      .number()
      .max(10 * 1024 * 1024, 'File size cannot exceed 10MB')
      .min(1, 'File cannot be empty')
  }),

  // Search query validation
  searchQuery: z.object({
    query: z
      .string()
      .max(200, errorMessages.tooLong)
      .min(1, errorMessages.required)
      .refine(customValidators.noSqlInjection, {
        message: errorMessages.sqlInjection
      })
      .transform(val => val.trim().replace(/\s+/g, ' ')),
    limit: z
      .number()
      .min(1, errorMessages.required)
      .max(100, 'Too many results requested')
      .default(20)
      .optional(),
    offset: z.number().min(0, 'Invalid offset').max(1000, 'Offset too large').default(0).optional()
  }),

  // Pagination validation
  pagination: z.object({
    page: z
      .number()
      .min(1, 'Page must be at least 1')
      .max(1000, 'Page number too large')
      .default(1),
    limit: z
      .number()
      .min(1, 'Limit must be at least 1')
      .max(100, 'Limit cannot exceed 100')
      .default(20)
  }),

  // Email validation
  email: z.object({
    email: z
      .string()
      .email(errorMessages.invalidEmail)
      .max(255, errorMessages.tooLong)
      .refine(customValidators.noXss, {
        message: errorMessages.xssRisk
      })
  }),

  // URL validation
  url: z.object({
    url: z
      .string()
      .url(errorMessages.invalidUrl)
      .max(2048, errorMessages.tooLong)
      .refine(customValidators.noXss, {
        message: errorMessages.xssRisk
      })
  }),

  // Mock trial lobby validation
  mockTrialLobby: z.object({
    action: z.enum(['create', 'join', 'leave']),
    lobbyCode: z
      .string()
      .regex(/^[A-Z0-9]{6}$/, 'Invalid lobby code format')
      .length(6, 'Lobby code must be exactly 6 characters')
      .optional(),
    playerName: z
      .string()
      .min(1, errorMessages.required)
      .max(50, errorMessages.tooLong)
      .regex(patterns.safeString, errorMessages.invalidChars)
      .refine(customValidators.noXss, {
        message: errorMessages.xssRisk
      })
      .refine(customValidators.noSqlInjection, {
        message: errorMessages.sqlInjection
      })
      .optional(),
    role: z.enum(['prosecutor', 'defense', 'judge', 'witness']).optional()
  }),

  // Mock trial start validation
  mockTrialStart: z
    .object({
      caseType: z.enum(['criminal', 'civil']),
      caseId: z.string().regex(patterns.objectId, 'Invalid case ID format').optional(),
      role: z.enum(['prosecutor', 'defense', 'judge']),
      playerName: z
        .string()
        .min(1, errorMessages.required)
        .max(50, errorMessages.tooLong)
        .regex(patterns.safeString, errorMessages.invalidChars)
        .refine(customValidators.noXss, {
          message: errorMessages.xssRisk
        })
        .refine(customValidators.noSqlInjection, {
          message: errorMessages.sqlInjection
        })
    })
    .refine(
      data => {
        // If caseId is provided, it must be a valid ObjectId
        if (data.caseId && !patterns.objectId.test(data.caseId)) {
          return false
        }
        return true
      },
      {
        message: 'Invalid case ID format'
      }
    )
}

/**
 * Input sanitization utilities
 */
export const sanitizers = {
  escapeHtml: (input: string): string => {
    return input
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;')
  },

  removeControlChars: (input: string): string => {
    // eslint-disable-next-line no-control-regex
    return input.replace(/[\x00-\x1F\x7F]/g, '')
  },

  normalizeWhitespace: (input: string): string => {
    return input.trim().replace(/\s+/g, ' ')
  },

  sanitizeFilename: (input: string): string => {
    return input
      .replace(/[<>:"/\\|?*]/g, '')
      .replace(/\s+/g, '_')
      .toLowerCase()
  },

  sanitizeQuery: (input: string): string => {
    return (
      input
        .replace(/[<>'"&]/g, '')
        // eslint-disable-next-line no-control-regex
        .replace(/[\x00-\x1F\x7F]/g, '')
        .trim()
    )
  }
}

/**
 * Rate limiting configuration
 */
export const rateLimits = {
  perMinute: {
    default: 100,
    search: 30,
    upload: 10,
    auth: 50
  },

  perHour: {
    default: 1000,
    search: 500,
    upload: 100,
    auth: 200
  },

  perDay: {
    default: 10000,
    search: 5000,
    upload: 1000,
    auth: 2000
  }
}

/**
 * Enhanced validation function with comprehensive error handling
 */
export function validateData<T>(schema: z.ZodSchema<T>, data: unknown): T {
  try {
    const result = schema.parse(data)

    if (process.env.NODE_ENV === 'development') {
      console.log('✅ Validation successful:', result)
    }

    return result
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      const fieldErrors = error.issues.map(issue => ({
        field: issue.path.join('.'),
        message: issue.message,
        code: issue.code
      }))

      const validationError = Object.assign(
        new Error(
          `Validation failed: ${fieldErrors.map(e => `${e.field}: ${e.message}`).join(', ')}`
        ),
        { validationErrors: fieldErrors, statusCode: 400 }
      )

      if (process.env.NODE_ENV === 'development') {
        console.error('❌ Validation failed:', fieldErrors)
      }

      throw validationError
    }

    if (process.env.NODE_ENV === 'development') {
      console.error('❌ Unexpected validation error:', error)
    }

    throw error
  }
}

/**
 * Utility functions for common validation patterns
 */
export const validators = {
  validateString: (
    value: unknown,
    options?: {
      required?: boolean
      minLength?: number
      maxLength?: number
      pattern?: RegExp
      sanitize?: boolean
    }
  ) => {
    let result = typeof value === 'string' ? value : String(value ?? '')

    if (options?.sanitize) {
      result = sanitizers.normalizeWhitespace(result)
      result = sanitizers.removeControlChars(result)
    }

    if (options?.required && !result) {
      throw new Error(errorMessages.required)
    }

    if (options?.minLength && result.length < options.minLength) {
      throw new Error(`Value must be at least ${options.minLength} characters`)
    }

    if (options?.maxLength && result.length > options.maxLength) {
      throw new Error(`Value cannot exceed ${options.maxLength} characters`)
    }

    if (options?.pattern && !options.pattern.test(result)) {
      throw new Error(errorMessages.invalidFormat)
    }

    return result
  },

  validateNumber: (
    value: unknown,
    options?: {
      required?: boolean
      min?: number
      max?: number
      integer?: boolean
    }
  ) => {
    const num = Number(value)

    if (isNaN(num)) {
      throw new Error(errorMessages.invalidType)
    }

    if (options?.required && (value === null || value === undefined)) {
      throw new Error(errorMessages.required)
    }

    if (options?.min !== undefined && num < options.min) {
      throw new Error(`Value must be at least ${options.min}`)
    }

    if (options?.max !== undefined && num > options.max) {
      throw new Error(`Value cannot exceed ${options.max}`)
    }

    if (options?.integer && !Number.isInteger(num)) {
      throw new Error('Value must be an integer')
    }

    return num
  },

  validateBoolean: (value: unknown, options?: { required?: boolean }) => {
    if (options?.required && (value === null || value === undefined)) {
      throw new Error(errorMessages.required)
    }

    return Boolean(value)
  },

  validateArray: (
    value: unknown,
    options?: {
      required?: boolean
      minLength?: number
      maxLength?: number
      itemType?: 'string' | 'number' | 'object'
    }
  ) => {
    if (!Array.isArray(value)) {
      throw new Error('Value must be an array')
    }

    if (options?.required && value.length === 0) {
      throw new Error(errorMessages.required)
    }

    if (options?.minLength && value.length < options.minLength) {
      throw new Error(`Array must have at least ${options.minLength} items`)
    }

    if (options?.maxLength && value.length > options.maxLength) {
      throw new Error(`Array cannot have more than ${options.maxLength} items`)
    }

    if (options?.itemType) {
      value.forEach((item, index) => {
        const itemType = typeof item
        if (itemType !== options.itemType) {
          throw new Error(`Array item at index ${index} must be ${options.itemType}`)
        }
      })
    }

    return value
  },

  validateDate: (
    value: unknown,
    options?: {
      required?: boolean
      minDate?: Date
      maxDate?: Date
      format?: 'iso' | 'timestamp'
    }
  ) => {
    let date: Date

    if (typeof value === 'string') {
      date = new Date(value)
    } else if (value instanceof Date) {
      date = value
    } else if (typeof value === 'number') {
      date = new Date(value)
    } else {
      throw new Error(errorMessages.invalidType)
    }

    if (isNaN(date.getTime())) {
      throw new Error('Invalid date format')
    }

    if (options?.minDate && date < options.minDate) {
      throw new Error('Date is too early')
    }

    if (options?.maxDate && date > options.maxDate) {
      throw new Error('Date is too late')
    }

    return date
  }
}

// Export patterns and utilities for external use
export { patterns, customValidators, errorMessages }
