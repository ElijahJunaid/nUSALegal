import { defineNuxtPlugin, useRouter } from '#imports'

export const DEBUG = true

export const dLog = (...a: unknown[]) => {
  if (DEBUG) console.log(...a)
}
export const dWarn = (...a: unknown[]) => {
  if (DEBUG) console.warn(...a)
}
export const dError = (...a: unknown[]) => {
  if (DEBUG) console.error(...a)
}

export default defineNuxtPlugin(nuxtApp => {
  if (!DEBUG) return

  dLog('🔷 [DEBUG] Plugin initialized')

  const router = useRouter()

  nuxtApp.hook('app:created', () => {
    dLog('🔷 [DEBUG] App created')
  })

  nuxtApp.hook('app:mounted', () => {
    dLog('🔷 [DEBUG] App mounted')
  })

  nuxtApp.hook('app:beforeMount', () => {
    dLog('🔷 [DEBUG] App before mount')
  })

  nuxtApp.hook('page:start', () => {
    dLog('🔷 [DEBUG] Page start')
  })

  nuxtApp.hook('page:finish', () => {
    dLog('🔷 [DEBUG] Page finish')
  })

  if (process.client) {
    const originalFetch = window.fetch
    window.fetch = function (...args) {
      dLog('🔷 [DEBUG] Fetch request:', args[0])
      return originalFetch
        .apply(this, args)
        .then(response => {
          dLog('🔷 [DEBUG] Fetch response:', args[0], response.status)
          return response
        })
        .catch(error => {
          dError('🔷 [DEBUG] Fetch error:', args[0], error)
          throw error
        })
    }

    const OriginalWebSocket = window.WebSocket
    const WebSocketProxy = function (url: string | URL, protocols?: string | string[]) {
      const currentOrigin = window.location.origin
      dLog(`🔷 [DEBUG] WebSocket connecting to: ${url} (Current Origin: ${currentOrigin})`)
      const ws = new OriginalWebSocket(url, protocols)

      ws.addEventListener('open', () => {
        dLog('✅ [DEBUG] WebSocket opened:', url)
      })

      ws.addEventListener('close', event => {
        dLog(`❌ [DEBUG] WebSocket closed (Code: ${event.code}, Reason: ${event.reason}):`, url)
      })

      ws.addEventListener('error', error => {
        dError('❌ [DEBUG] WebSocket error:', url, error)
      })

      return ws
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any

    WebSocketProxy.prototype = OriginalWebSocket.prototype
    WebSocketProxy.CONNECTING = OriginalWebSocket.CONNECTING
    WebSocketProxy.OPEN = OriginalWebSocket.OPEN
    WebSocketProxy.CLOSING = OriginalWebSocket.CLOSING
    WebSocketProxy.CLOSED = OriginalWebSocket.CLOSED

    window.WebSocket = WebSocketProxy as typeof WebSocket

    const OriginalXMLHttpRequest = window.XMLHttpRequest
    const XMLHttpRequestProxy = function () {
      const xhr = new OriginalXMLHttpRequest()
      const originalOpen = xhr.open

      xhr.open = function (
        method: string,
        url: string | URL,
        async?: boolean,
        username?: string | null,
        password?: string | null
      ): void {
        dLog('🔷 [DEBUG] XHR request:', method, url)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return originalOpen.call(this, method, url, async as any, username as any, password as any)
      }

      xhr.addEventListener('load', function () {
        dLog('🔷 [DEBUG] XHR response:', this.status, this.responseURL)
      })

      xhr.addEventListener('error', function () {
        dError('🔷 [DEBUG] XHR error:', this.responseURL)
      })

      return xhr
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any

    XMLHttpRequestProxy.prototype = OriginalXMLHttpRequest.prototype
    XMLHttpRequestProxy.UNSENT = OriginalXMLHttpRequest.UNSENT
    XMLHttpRequestProxy.OPENED = OriginalXMLHttpRequest.OPENED
    XMLHttpRequestProxy.HEADERS_RECEIVED = OriginalXMLHttpRequest.HEADERS_RECEIVED
    XMLHttpRequestProxy.LOADING = OriginalXMLHttpRequest.LOADING
    XMLHttpRequestProxy.DONE = OriginalXMLHttpRequest.DONE

    window.XMLHttpRequest = XMLHttpRequestProxy as typeof XMLHttpRequest

    window.addEventListener('error', event => {
      dError('🔷 [DEBUG] Window error:', event.message, event.filename, event.lineno)
    })

    window.addEventListener('unhandledrejection', event => {
      dError('🔷 [DEBUG] Unhandled promise rejection:', event.reason)
    })

    router.beforeEach((to, from) => {
      dLog('🔷 [DEBUG] Route navigation:', from.path, '->', to.path)
    })

    dLog('🔷 [DEBUG] All interceptors installed')
  }
})
