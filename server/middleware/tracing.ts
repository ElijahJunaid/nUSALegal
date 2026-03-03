import { eventHandler } from 'h3'
import { tracingManager } from '../utils/tracing'

export default eventHandler((event) => {
  const method = event.node.req.method || 'GET'
  const url = event.node.req.url || '/'
  
  const existingTraceId = event.node.req.headers['x-trace-id'] as string
  const existingSpanId = event.node.req.headers['x-span-id'] as string
  
  const traceId = existingTraceId || tracingManager.startTrace({
    method,
    url,
    userAgent: event.node.req.headers['user-agent'],
    ip: event.node.req.headers['x-forwarded-for'] || event.node.req.socket?.remoteAddress
  })
  
  const spanId = existingSpanId || tracingManager.startSpan(traceId, `${method} ${url}`, {
    operation: 'http.request',
    method,
    url
  })
  
  event.context.traceId = traceId
  event.context.spanId = spanId
  
  event.node.res.setHeader('X-Trace-Id', traceId)
  if (spanId) {
    event.node.res.setHeader('X-Span-Id', spanId)
  }
  
  const startTime = Date.now()
  
  event.node.res.on('finish', () => {
    const duration = Date.now() - startTime
    const statusCode = event.node.res.statusCode
    
    if (spanId) {
      tracingManager.endSpan(traceId, spanId, {
        statusCode,
        duration: `${duration}ms`
      })
    }
    
    if (!existingTraceId) {
      tracingManager.endTrace(traceId, {
        statusCode,
        success: statusCode < 400
      })
    }
  })
})