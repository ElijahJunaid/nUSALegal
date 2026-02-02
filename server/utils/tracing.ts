import { randomUUID } from 'crypto'

interface TraceContext {
  traceId: string
  spanId: string
  parentSpanId?: string
  startTime: number
  metadata: Record<string, any>
}

class TracingManager {
  private traces: Map<string, TraceContext>
  private activeSpans: Map<string, string>

  constructor() {
    this.traces = new Map()
    this.activeSpans = new Map()
  }

  startTrace(metadata: Record<string, any> = {}): string {
    const traceId = randomUUID()
    const spanId = randomUUID()
    
    const context: TraceContext = {
      traceId,
      spanId,
      startTime: Date.now(),
      metadata: {
        ...metadata,
        timestamp: new Date().toISOString()
      }
    }
    
    this.traces.set(traceId, context)
    this.activeSpans.set(traceId, spanId)
    
    return traceId
  }

  startSpan(traceId: string, name: string, metadata: Record<string, any> = {}): string | null {
    const trace = this.traces.get(traceId)
    if (!trace) return null
    
    const spanId = randomUUID()
    const parentSpanId = this.activeSpans.get(traceId)
    
    this.activeSpans.set(traceId, spanId)
    
    return spanId
  }

  endSpan(traceId: string, spanId: string, metadata: Record<string, any> = {}) {
    const trace = this.traces.get(traceId)
    if (!trace) return
    
    const duration = Date.now() - trace.startTime
    
    trace.metadata = {
      ...trace.metadata,
      ...metadata,
      duration: `${duration}ms`,
      endTime: new Date().toISOString()
    }
  }

  endTrace(traceId: string, metadata: Record<string, any> = {}) {
    const trace = this.traces.get(traceId)
    if (!trace) return
    
    const duration = Date.now() - trace.startTime
    
    trace.metadata = {
      ...trace.metadata,
      ...metadata,
      totalDuration: `${duration}ms`,
      completedAt: new Date().toISOString()
    }
    
    this.activeSpans.delete(traceId)
    
    setTimeout(() => {
      this.traces.delete(traceId)
    }, 60000)
  }

  getTrace(traceId: string): TraceContext | undefined {
    return this.traces.get(traceId)
  }

  getAllTraces(): TraceContext[] {
    return Array.from(this.traces.values())
  }

  getTraceMetadata(traceId: string): Record<string, any> | null {
    const trace = this.traces.get(traceId)
    return trace ? trace.metadata : null
  }

  addMetadata(traceId: string, key: string, value: any) {
    const trace = this.traces.get(traceId)
    if (trace) {
      trace.metadata[key] = value
    }
  }

  getActiveTraceCount(): number {
    return this.traces.size
  }
}

export const tracingManager = new TracingManager()

export function generateTraceId(): string {
  return randomUUID()
}

export function generateSpanId(): string {
  return randomUUID()
}