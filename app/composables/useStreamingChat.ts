import { useCasebotStore } from '~/stores/casebot-store'

const STREAM_TIMEOUT_MS = 90_000 // 90s total timeout
const IDLE_TIMEOUT_MS = 15_000 // 15s no tokens = "still thinking"

export function useStreamingChat() {
  const store = useCasebotStore()

  async function streamChat(query: string, onChunk?: () => void): Promise<void> {
    store.isLoading = true

    try {
      const response = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, thread_id: store.threadId })
      })

      const contentType = response.headers.get('content-type') || ''
      if (contentType.includes('application/json')) {
        const data = await response.json()
        if (data?.thread_id) store.setThreadId(data.thread_id)
        if (data?.response) {
          store.addMessage({ text: data.response, type: 'bot', isMarkdown: true })
        }
        return
      }

      if (!response.ok) {
        const retryAfter = response.headers.get('retry-after')
        if (response.status === 429 && retryAfter) {
          startRetryCountdown(parseInt(retryAfter, 10))
        } else if (response.status === 429) {
          store.addMessage({
            text: '⚠️ Too many requests. Please wait a moment before trying again.',
            type: 'bot',
            isMarkdown: false
          })
        } else if (response.status === 400) {
          store.addMessage({
            text: '⚠️ Invalid request. Please try rephrasing your question.',
            type: 'bot',
            isMarkdown: false
          })
        } else if (response.status === 503) {
          store.addMessage({
            text: '⚠️ CaseBot is temporarily unavailable. Please try again in a moment.',
            type: 'bot',
            isMarkdown: false
          })
        } else {
          store.addMessage({
            text: "⚠️ Something went wrong. Your message wasn't lost — try sending again.",
            type: 'bot',
            isMarkdown: false
          })
        }
        return
      }

      const reader = response.body!.getReader()
      const decoder = new TextDecoder()

      store.addMessage({ text: '', type: 'bot', isMarkdown: true })
      const msgIdx = store.messages.length - 1
      let buffer = ''
      let lastTokenTime = Date.now()
      const streamStart = Date.now()
      let idleWarningShown = false

      const idleInterval = setInterval(() => {
        const now = Date.now()

        if (now - streamStart > STREAM_TIMEOUT_MS) {
          clearInterval(idleInterval)
          reader.cancel()
          if (!store.messages[msgIdx].text) {
            store.messages[msgIdx].text =
              '⚠️ CaseBot is taking longer than usual. The response may be complex — please try a shorter question.'
            store.messages[msgIdx].isMarkdown = false
          }
          return
        }

        if (
          now - lastTokenTime > IDLE_TIMEOUT_MS &&
          !idleWarningShown &&
          store.messages[msgIdx].text
        ) {
          idleWarningShown = true
          store.messages[msgIdx].text += '\n\n_Still thinking..._'
          onChunk?.()
        }
      }, 2000)

      try {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split('\n')
          buffer = lines.pop() || ''

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.slice(6))
                if (data.thread_id) store.setThreadId(data.thread_id)
                if (data.token) {
                  if (idleWarningShown) {
                    store.messages[msgIdx].text = store.messages[msgIdx].text.replace(
                      /\n\n_Still thinking\.\.\._$/,
                      ''
                    )
                    idleWarningShown = false
                  }
                  store.messages[msgIdx].text += data.token
                  lastTokenTime = Date.now()
                }
                if (data.done) {
                  if (data.citations?.length) {
                    store.messages[msgIdx].sources = data.citations.map((c: unknown) =>
                      typeof c === 'string' ? { filename: c } : c
                    )
                  }
                  if (data.followups?.length) store.messages[msgIdx].followups = data.followups
                }
                if (data.error) {
                  store.messages[msgIdx].text = `⚠️ ${data.error}`
                  store.messages[msgIdx].isMarkdown = false
                }
              } catch {
                // Skip malformed JSON lines
              }
            }
          }
          onChunk?.()
        }
      } finally {
        clearInterval(idleInterval)
      }

      if (!store.messages[msgIdx].text) {
        store.messages.splice(msgIdx, 1)
      }
    } catch {
      store.addMessage({
        text: '⚠️ Connection lost. Check your internet connection and try again.',
        type: 'bot',
        isMarkdown: false
      })
    } finally {
      store.isLoading = false
    }
  }

  function startRetryCountdown(seconds: number) {
    let remaining = seconds
    const msg = store.addRetryMessage(remaining)
    const interval = setInterval(() => {
      remaining--
      if (remaining <= 0) {
        clearInterval(interval)
        store.updateRetryMessage(msg, '⚠️ You can try sending your message again now.')
      } else {
        store.updateRetryMessage(msg, `⚠️ Too many requests. Try again in ${remaining} seconds.`)
      }
    }, 1000)
  }

  return { streamChat }
}
