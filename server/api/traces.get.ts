import { defineEventHandler, getQuery } from 'h3'
import { tracingManager } from '../utils/tracing'

export default defineEventHandler((event) => {
  const query = getQuery(event)
  const traceId = query.traceId as string | undefined

  if (traceId) {
    const trace = tracingManager.getTrace(traceId)
    
    if (!trace) {
      return {
        success: false,
        error: 'Trace not found',
        traceId
      }
    }

    return {
      success: true,
      trace
    }
  }

  const allTraces = tracingManager.getAllTraces()
  
  return {
    success: true,
    count: allTraces.length,
    activeTraces: tracingManager.getActiveTraceCount(),
    traces: allTraces.map(trace => ({
      traceId: trace.traceId,
      spanId: trace.spanId,
      startTime: new Date(trace.startTime).toISOString(),
      metadata: trace.metadata
    }))
  }
})