import { defineNuxtPlugin, useRouter } from '#imports'

export default defineNuxtPlugin(nuxtApp => {
  console.log('🔷 [DEBUG] Plugin initialized')

  const router = useRouter()

  nuxtApp.hook('app:created', () => {
    console.log('🔷 [DEBUG] App created')
  })

  nuxtApp.hook('app:mounted', () => {
    console.log('🔷 [DEBUG] App mounted')
  })

  nuxtApp.hook('app:beforeMount', () => {
    console.log('🔷 [DEBUG] App before mount')
  })

  nuxtApp.hook('page:start', () => {
    console.log('🔷 [DEBUG] Page start')
  })

  nuxtApp.hook('page:finish', () => {
    console.log('🔷 [DEBUG] Page finish')
  })

  if (process.client) {
    const originalFetch = window.fetch
    window.fetch = function (...args) {
      console.log('🔷 [DEBUG] Fetch request:', args[0])
      return originalFetch
        .apply(this, args)
        .then(response => {
          console.log('🔷 [DEBUG] Fetch response:', args[0], response.status)
          return response
        })
        .catch(error => {
          console.error('🔷 [DEBUG] Fetch error:', args[0], error)
          throw error
        })
    }

    const OriginalWebSocket = window.WebSocket
    const WebSocketProxy = function (url: string | URL, protocols?: string | string[]) {
      console.log('🔷 [DEBUG] WebSocket connecting:', url)
      const ws = new OriginalWebSocket(url, protocols)

      ws.addEventListener('open', () => {
        console.log('🔷 [DEBUG] WebSocket opened:', url)
      })

      ws.addEventListener('close', () => {
        console.log('🔷 [DEBUG] WebSocket closed:', url)
      })

      ws.addEventListener('error', error => {
        console.error('🔷 [DEBUG] WebSocket error:', url, error)
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
        console.log('🔷 [DEBUG] XHR request:', method, url)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return originalOpen.call(this, method, url, async as any, username as any, password as any)
      }

      xhr.addEventListener('load', function () {
        console.log('🔷 [DEBUG] XHR response:', this.status, this.responseURL)
      })

      xhr.addEventListener('error', function () {
        console.error('🔷 [DEBUG] XHR error:', this.responseURL)
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
      console.error('🔷 [DEBUG] Window error:', event.message, event.filename, event.lineno)
    })

    window.addEventListener('unhandledrejection', event => {
      console.error('🔷 [DEBUG] Unhandled promise rejection:', event.reason)
    })

    router.beforeEach((to, from) => {
      console.log('🔷 [DEBUG] Route navigation:', from.path, '->', to.path)
    })

    console.log('🔷 [DEBUG] All interceptors installed')
  }
})
