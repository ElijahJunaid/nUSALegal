import winston from 'winston'

type LogMeta = Record<string, unknown>

const { combine, timestamp, json, printf, colorize, errors } = winston.format

const devFormat = printf(({ level, message, timestamp, ...metadata }) => {
  let msg = `${timestamp} [${level}]: ${message}`

  if (Object.keys(metadata).length > 0) {
    msg += ` ${JSON.stringify(metadata, null, 2)}`
  }

  return msg
})

const prodFormat = combine(
  timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  errors({ stack: true }),
  json()
)

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || (process.env.NODE_ENV === 'production' ? 'info' : 'debug'),
  format:
    process.env.NODE_ENV === 'production'
      ? prodFormat
      : combine(
          colorize(),
          timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
          errors({ stack: true }),
          devFormat
        ),
  defaultMeta: {
    service: 'nusalegal',
    environment: process.env.NODE_ENV || 'development'
  },
  transports: [
    new winston.transports.Console({
      handleExceptions: true,
      handleRejections: true
    })
  ],
  exitOnError: false
})

export const log = {
  debug: (message: string, meta?: LogMeta) => {
    logger.debug(message, meta)
  },

  info: (message: string, meta?: LogMeta) => {
    logger.info(message, meta)
  },

  warn: (message: string, meta?: LogMeta) => {
    logger.warn(message, meta)
  },

  error: (message: string, error?: Error | unknown, meta?: LogMeta) => {
    const errorMeta =
      error instanceof Error
        ? {
            error: {
              message: error.message,
              stack: error.stack,
              name: error.name
            },
            ...meta
          }
        : { error, ...meta }

    logger.error(message, errorMeta)
  },

  http: (method: string, path: string, statusCode: number, duration: number, meta?: LogMeta) => {
    logger.info('HTTP Request', {
      method,
      path,
      statusCode,
      duration: `${duration}ms`,
      ...meta
    })
  },

  api: (service: string, operation: string, success: boolean, meta?: LogMeta) => {
    logger.info('API Call', {
      service,
      operation,
      success,
      ...meta
    })
  },

  db: (operation: string, table: string, duration: number, meta?: LogMeta) => {
    logger.debug('Database Operation', {
      operation,
      table,
      duration: `${duration}ms`,
      ...meta
    })
  },

  security: (event: string, severity: 'low' | 'medium' | 'high' | 'critical', meta?: LogMeta) => {
    logger.warn('Security Event', {
      event,
      severity,
      timestamp: new Date().toISOString(),
      ...meta
    })
  },

  performance: (metric: string, value: number, unit: string, meta?: LogMeta) => {
    logger.info('Performance Metric', {
      metric,
      value,
      unit,
      ...meta
    })
  }
}

export default logger
