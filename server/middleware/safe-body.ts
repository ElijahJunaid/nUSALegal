import { createError, defineEventHandler, type H3Event } from 'h3'
import { validateData } from '../utils/validation'
import { z } from 'zod'
import type { IncomingMessage } from 'node:http'

export default defineEventHandler(() => {})

type RequestWithBody = IncomingMessage & { body?: unknown }

export async function validateAndReplaceBody<T>(
  event: H3Event,
  schema: z.ZodSchema<T>
): Promise<T> {
  const req = event.node?.req as RequestWithBody | undefined

  try {
    let body: unknown

    if (req?.body) {
      if (typeof req.body === 'string') {
        body = JSON.parse(req.body)
      } else if (req.body instanceof Buffer) {
        body = JSON.parse(req.body.toString())
      } else if (
        req.body &&
        typeof (req.body as { getReader?: unknown }).getReader === 'function'
      ) {
        const reader = (
          req.body as {
            getReader: () => { read: () => Promise<{ done: boolean; value?: Uint8Array }> }
          }
        ).getReader()
        const parts: Uint8Array[] = []
        for (;;) {
          const { done, value } = await reader.read()
          if (done) break
          if (value) parts.push(value)
        }
        const totalLen = parts.reduce((n, p) => n + p.length, 0)
        const merged = new Uint8Array(totalLen)
        let offset = 0
        for (const p of parts) {
          merged.set(p, offset)
          offset += p.length
        }
        body = JSON.parse(Buffer.from(merged).toString('utf-8'))
      } else if (typeof req.body === 'object' && !Buffer.isBuffer(req.body)) {
        body = req.body
      } else {
        throw new Error('Invalid body type')
      }
    } else {
      const chunks: Buffer[] = []
      for await (const chunk of req) {
        chunks.push(chunk)
      }
      const rawBody = Buffer.concat(chunks).toString()
      body = JSON.parse(rawBody)
    }

    const validatedData = validateData(schema, body)

    if (req) {
      req.body = validatedData
    }

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
