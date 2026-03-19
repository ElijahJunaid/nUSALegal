import { defineEventHandler, createError, type H3Event } from 'h3'
import type { IncomingMessage } from 'http'

interface FeedbackBody {
  thread_id?: string
  message_index?: number
  rating: 'up' | 'down'
  message_preview?: string
}

function parseBody(event: H3Event): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = []
    const req = event.node.req as IncomingMessage
    req.on('data', (chunk: Buffer) => chunks.push(chunk))
    req.on('end', () => resolve(Buffer.concat(chunks).toString()))
    req.on('error', reject)
  })
}

const handler = defineEventHandler(async event => {
  const raw = await parseBody(event)
  const body = JSON.parse(raw) as FeedbackBody

  if (!body.rating || !['up', 'down'].includes(body.rating)) {
    throw createError({ status: 400, message: 'rating must be "up" or "down"' })
  }

  console.log('[Chatbot Feedback]', {
    thread_id: body.thread_id,
    message_index: body.message_index,
    rating: body.rating,
    message_preview: body.message_preview?.slice(0, 100),
    timestamp: new Date().toISOString()
  })

  return { success: true }
})

// Mark as already wrapped to prevent Nitro double-wrapping warning
;(handler as unknown as Record<string, unknown>).__is_handler__ = true

export default handler
