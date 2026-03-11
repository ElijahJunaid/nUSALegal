import { createError, type H3Event } from 'h3'
import { validateData } from '../utils/validation'
import { z } from 'zod'
import type { IncomingMessage } from 'node:http'

type RequestWithBody = IncomingMessage & { body?: unknown }

/**
 * Validates and replaces request body to prevent unvalidated access detection
 */
export async function validateAndReplaceBody<T>(
  event: H3Event,
  schema: z.ZodSchema<T>
): Promise<T> {
  const req = event.node?.req as RequestWithBody | undefined

  try {
    let body: unknown

    // Parse body from various sources
    if (req?.body) {
      if (typeof req.body === 'string') {
        body = JSON.parse(req.body)
      } else if (req.body instanceof Buffer) {
        body = JSON.parse(req.body.toString())
      } else if (typeof req.body === 'object' && !Buffer.isBuffer(req.body)) {
        body = req.body
      } else {
        throw new Error('Invalid body type')
      }
    } else {
      // Try to read from stream
      const chunks: Buffer[] = []
      for await (const chunk of req) {
        chunks.push(chunk)
      }
      const rawBody = Buffer.concat(chunks).toString()
      body = JSON.parse(rawBody)
    }

    // Validate the parsed body
    const validatedData = validateData(schema, body)

    // Replace the raw req.body with validated data
    if (req) {
      req.body = validatedData
    }

    // Store in event context for later access
    event.context.validatedBody = validatedData

    return validatedData as T
  } catch (error: unknown) {
    const e = error as { statusCode?: number; message?: string; validationErrors?: unknown[] }
    const statusCode = e?.statusCode || 400
    const message = e?.message || 'Validation failed'

    throw createError({
      status: statusCode,
      statusText: 'Validation Error',
      message,
      data: e?.validationErrors || []
    })
  }
}
