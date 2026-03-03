import { defineEventHandler, getQuery } from 'h3'
import { metricsCollector } from '../utils/metrics'

export default defineEventHandler((event) => {
  const query = getQuery(event)
  const format = query.format || 'json'

  if (format === 'prometheus') {
    event.node.res.setHeader('Content-Type', 'text/plain; version=0.0.4')
    return metricsCollector.getPrometheusFormat()
  }

  const metrics = metricsCollector.getMetrics()
  
  return {
    success: true,
    timestamp: new Date().toISOString(),
    metrics
  }
})