interface MetricData {
  count: number
  totalDuration?: number
  lastUpdated: number
}

interface Metrics {
  requests: Record<string, MetricData>
  errors: Record<string, MetricData>
  apiCalls: Record<string, MetricData>
  database: Record<string, MetricData>
  uptime: number
  startTime: number
}

class MetricsCollector {
  private metrics: Metrics

  constructor() {
    this.metrics = {
      requests: {},
      errors: {},
      apiCalls: {},
      database: {},
      uptime: 0,
      startTime: Date.now()
    }
  }

  recordRequest(method: string, path: string, statusCode: number, duration: number) {
    const key = `${method}:${path}:${statusCode}`
    
    if (!this.metrics.requests[key]) {
      this.metrics.requests[key] = {
        count: 0,
        totalDuration: 0,
        lastUpdated: Date.now()
      }
    }
    
    this.metrics.requests[key].count++
    this.metrics.requests[key].totalDuration = (this.metrics.requests[key].totalDuration || 0) + duration
    this.metrics.requests[key].lastUpdated = Date.now()
  }

  recordError(type: string, message: string) {
    const key = `${type}:${message}`
    
    if (!this.metrics.errors[key]) {
      this.metrics.errors[key] = {
        count: 0,
        lastUpdated: Date.now()
      }
    }
    
    this.metrics.errors[key].count++
    this.metrics.errors[key].lastUpdated = Date.now()
  }

  recordApiCall(service: string, operation: string, success: boolean, duration: number) {
    const key = `${service}:${operation}:${success ? 'success' : 'failure'}`
    
    if (!this.metrics.apiCalls[key]) {
      this.metrics.apiCalls[key] = {
        count: 0,
        totalDuration: 0,
        lastUpdated: Date.now()
      }
    }
    
    this.metrics.apiCalls[key].count++
    this.metrics.apiCalls[key].totalDuration = (this.metrics.apiCalls[key].totalDuration || 0) + duration
    this.metrics.apiCalls[key].lastUpdated = Date.now()
  }

  recordDatabaseQuery(operation: string, table: string, duration: number) {
    const key = `${operation}:${table}`
    
    if (!this.metrics.database[key]) {
      this.metrics.database[key] = {
        count: 0,
        totalDuration: 0,
        lastUpdated: Date.now()
      }
    }
    
    this.metrics.database[key].count++
    this.metrics.database[key].totalDuration = (this.metrics.database[key].totalDuration || 0) + duration
    this.metrics.database[key].lastUpdated = Date.now()
  }

  getMetrics() {
    this.metrics.uptime = Date.now() - this.metrics.startTime
    
    const summarize = (data: Record<string, MetricData>) => {
      const summary: Record<string, any> = {}
      
      Object.entries(data).forEach(([key, value]) => {
        summary[key] = {
          count: value.count,
          avgDuration: value.totalDuration && value.count > 0 
            ? Math.round(value.totalDuration / value.count) 
            : undefined,
          lastUpdated: new Date(value.lastUpdated).toISOString()
        }
      })
      
      return summary
    }

    return {
      uptime: Math.floor(this.metrics.uptime / 1000),
      startTime: new Date(this.metrics.startTime).toISOString(),
      requests: {
        total: Object.values(this.metrics.requests).reduce((sum, m) => sum + m.count, 0),
        byEndpoint: summarize(this.metrics.requests)
      },
      errors: {
        total: Object.values(this.metrics.errors).reduce((sum, m) => sum + m.count, 0),
        byType: summarize(this.metrics.errors)
      },
      apiCalls: {
        total: Object.values(this.metrics.apiCalls).reduce((sum, m) => sum + m.count, 0),
        byService: summarize(this.metrics.apiCalls)
      },
      database: {
        total: Object.values(this.metrics.database).reduce((sum, m) => sum + m.count, 0),
        byOperation: summarize(this.metrics.database)
      }
    }
  }

  getPrometheusFormat() {
    const lines: string[] = []
    
    lines.push('# HELP app_uptime_seconds Application uptime in seconds')
    lines.push('# TYPE app_uptime_seconds gauge')
    lines.push(`app_uptime_seconds ${Math.floor((Date.now() - this.metrics.startTime) / 1000)}`)
    lines.push('')
    
    lines.push('# HELP http_requests_total Total number of HTTP requests')
    lines.push('# TYPE http_requests_total counter')
    Object.entries(this.metrics.requests).forEach(([key, value]) => {
      const [method, path, status] = key.split(':')
      lines.push(`http_requests_total{method="${method}",path="${path}",status="${status}"} ${value.count}`)
    })
    lines.push('')
    
    lines.push('# HELP http_request_duration_ms HTTP request duration in milliseconds')
    lines.push('# TYPE http_request_duration_ms histogram')
    Object.entries(this.metrics.requests).forEach(([key, value]) => {
      const [method, path, status] = key.split(':')
      const avg = value.totalDuration && value.count > 0 ? value.totalDuration / value.count : 0
      lines.push(`http_request_duration_ms{method="${method}",path="${path}",status="${status}"} ${avg.toFixed(2)}`)
    })
    lines.push('')
    
    lines.push('# HELP app_errors_total Total number of errors')
    lines.push('# TYPE app_errors_total counter')
    Object.entries(this.metrics.errors).forEach(([key, value]) => {
      const [type] = key.split(':')
      lines.push(`app_errors_total{type="${type}"} ${value.count}`)
    })
    
    return lines.join('\n')
  }

  reset() {
    this.metrics = {
      requests: {},
      errors: {},
      apiCalls: {},
      database: {},
      uptime: 0,
      startTime: Date.now()
    }
  }
}

export const metricsCollector = new MetricsCollector()