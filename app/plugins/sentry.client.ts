import * as Sentry from '@sentry/vue'
import { defineNuxtPlugin, useRuntimeConfig } from '#imports'
import { dLog, dWarn, dError } from '~/plugins/debug-logger.client'

export default defineNuxtPlugin(nuxtApp => {
  const config = useRuntimeConfig()

  // Early exit in development mode - prevent any Sentry initialization
  if (config.public.environment === 'development' || process.env.NODE_ENV === 'development') {
    dLog('Sentry completely disabled in development mode')
    return {
      provide: {
        sentry: null
      }
    }
  }

  if (config.public.sentryDsn) {
    Sentry.init({
      app: nuxtApp.vueApp,
      dsn: config.public.sentryDsn as string,
      environment: (config.public.environment as string) || 'production',

      tracesSampleRate: (config.public.sentrySampleRate as number) || 1.0,

      replaysSessionSampleRate: 0.1,
      replaysOnErrorSampleRate: 1.0,

      integrations: [
        Sentry.browserTracingIntegration({
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          router: nuxtApp.$router as any
        }),
        Sentry.replayIntegration({
          maskAllText: true,
          blockAllMedia: true
        })
      ],

      attachStacktrace: true,

      beforeSend(event, hint) {
        if (config.public.environment === 'development') {
          dError('Sentry Event (dev):', event, hint)
          return null
        }

        const error = hint.originalException
        if (error instanceof Error) {
          const skipMessages = [
            'ResizeObserver loop limit exceeded',
            'Non-Error promise rejection captured'
          ]

          if (skipMessages.some(msg => error.message.includes(msg))) {
            return null
          }
        }

        return event
      },

      ignoreErrors: [
        'top.GLOBALS',
        'canvas.contentDocument',
        "Can't find variable: ZiteReader",
        'jigsaw is not defined',
        'ComboSearch is not defined',
        'fb_xd_fragment',
        'NetworkError',
        'Failed to fetch'
      ],

      denyUrls: [/extensions\//i, /^chrome:\/\//, /^chrome-extension:\/\//]
    })

    nuxtApp.vueApp.config.errorHandler = (error: unknown, instance, info: string) => {
      dError('Vue Error:', error, info)

      Sentry.withScope(scope => {
        scope.setContext('vue', {
          componentName: instance?.$options?.name || 'Unknown',
          propsData: instance?.$props,
          info
        })
        Sentry.captureException(error)
      })
    }

    if (process.client) {
      window.addEventListener('unhandledrejection', event => {
        dError('Unhandled Rejection:', event.reason)

        Sentry.withScope(scope => {
          scope.setContext('promise', {
            promise: event.promise
          })
          Sentry.captureException(event.reason || new Error('Unhandled Promise rejection'))
        })
      })
    }
  } else {
    dWarn('Sentry DSN not configured. Error tracking disabled.')
  }

  return {
    provide: {
      sentry: Sentry
    }
  }
})
