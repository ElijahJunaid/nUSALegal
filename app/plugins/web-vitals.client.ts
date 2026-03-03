import { defineNuxtPlugin, useRuntimeConfig } from '#imports'
import { onCLS, onINP, onFCP, onLCP, onTTFB, type Metric } from 'web-vitals'

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()

  if (process.client) {
    const sendToAnalytics = (metric: Metric) => {
      if (config.public.environment === 'development') {
        console.log(`[Web Vitals] ${metric.name}:`, {
          value: metric.value,
          rating: metric.rating,
          delta: metric.delta,
        })
      }

      if (config.public.sentryDsn && nuxtApp.$sentry) {
        const Sentry = nuxtApp.$sentry as any
        Sentry.setMeasurement(metric.name, metric.value, 'millisecond')
        
        Sentry.setContext('web-vitals', {
          name: metric.name,
          value: metric.value,
          rating: metric.rating,
          navigationType: metric.navigationType,
        })

        Sentry.addBreadcrumb({
          category: 'web-vitals',
          message: `${metric.name}: ${metric.value}`,
          level: metric.rating === 'good' ? 'info' : metric.rating === 'needs-improvement' ? 'warning' : 'error',
          data: {
            value: metric.value,
            rating: metric.rating,
            delta: metric.delta,
          },
        })
      }
    }
    onCLS(sendToAnalytics)
    onINP(sendToAnalytics)
    onFCP(sendToAnalytics)
    onLCP(sendToAnalytics)
    onTTFB(sendToAnalytics)
  }
})