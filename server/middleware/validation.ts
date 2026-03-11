import { createError, defineEventHandler, type H3Event } from 'h3'
import { validateData, validationSchemas } from '../utils/validation'
import { z } from 'zod'
import type { IncomingMessage } from 'node:http'

export default defineEventHandler(() => {})

type RequestWithBody = IncomingMessage & { body?: unknown }

export { validationSchemas }

export function createValidationMiddleware<T>(schema: z.ZodSchema<T>) {
  return async (event: H3Event) => {
    try {
      let body: unknown

      try {
        const req = event.node?.req as RequestWithBody | undefined

        if (req?.body) {
          if (typeof req.body === 'string') {
            body = JSON.parse(req.body)
          } else if (req.body instanceof Buffer) {
            body = JSON.parse(req.body.toString())
          } else if (
            typeof req.body === 'object' &&
            !Buffer.isBuffer(req.body) &&
            !('getReader' in req.body)
          ) {
            body = req.body
          } else {
            const chunks: Buffer[] = []
            for await (const chunk of req) {
              chunks.push(chunk)
            }
            const rawBody = Buffer.concat(chunks).toString()
            body = JSON.parse(rawBody)
          }
        } else {
          const chunks: Buffer[] = []
          for await (const chunk of req) {
            chunks.push(chunk)
          }
          const rawBody = Buffer.concat(chunks).toString()
          body = JSON.parse(rawBody)
        }
      } catch {
        throw createError({
          status: 400,
          statusText: 'Bad Request',
          message: 'Invalid JSON in request body'
        })
      }

      const validatedData = validateData(schema, body)

      event.context.validatedBody = validatedData

      if (event.node?.req) {
        ;(event.node.req as { body?: unknown }).body = validatedData
      }

      return validatedData
    } catch (error: unknown) {
      const e = error as { message?: string; validationErrors?: unknown[] }
      if (e?.message?.includes('Validation failed')) {
        throw createError({
          status: 400,
          statusText: 'Validation Error',
          message: e.message,
          data: { validationErrors: e.validationErrors }
        })
      }
      throw error
    }
  }
}
