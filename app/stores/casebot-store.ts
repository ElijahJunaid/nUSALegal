import { defineStore } from 'pinia'

export interface CitationSource {
  filename: string
  quote?: string
}

export interface ChatMessage {
  text: string
  type: 'user' | 'bot'
  isMarkdown?: boolean
  sources?: CitationSource[]
  followups?: string[]
  timestamp?: number
  feedback?: 'up' | 'down'
}

export interface Conversation {
  id: string
  threadId: string
  title: string
  createdAt: number
  updatedAt: number
}

const THREAD_STORAGE_KEY = 'casebot_thread_id'
const FEEDBACK_STORAGE_KEY = 'casebot_feedback'
const CONVERSATIONS_STORAGE_KEY = 'casebot_conversations'

export const useCasebotStore = defineStore('casebot', {
  state: () => ({
    messages: [] as ChatMessage[],
    threadId: null as string | null,
    isLoading: false,
    historyLoaded: false,
    conversations: [] as Conversation[]
  }),

  actions: {
    async init() {
      if (this.historyLoaded) return

      this._loadConversations()

      const savedThreadId = localStorage.getItem(THREAD_STORAGE_KEY)
      if (savedThreadId) {
        this.threadId = savedThreadId
        await this.fetchHistory()
      }

      this.historyLoaded = true
    },

    async fetchHistory() {
      if (!this.threadId) return

      try {
        const data = await $fetch<{ thread_id: string | null; messages: ChatMessage[] }>(
          '/api/chatbot-history',
          { params: { thread_id: this.threadId } }
        )

        if (data.thread_id && data.messages.length > 0) {
          this.messages = data.messages
          this._restoreFeedback()
        } else {
          this.threadId = null
          this.messages = []
          localStorage.removeItem(THREAD_STORAGE_KEY)
        }
      } catch {
        // Fetch failed — keep existing state
      }
    },

    setThreadId(id: string) {
      this.threadId = id
      localStorage.setItem(THREAD_STORAGE_KEY, id)
    },

    addMessage(message: ChatMessage) {
      this.messages.push({ ...message, timestamp: message.timestamp || Date.now() })
    },

    updateLastBotMessage(text: string) {
      const last = this.messages[this.messages.length - 1]
      if (last && last.type === 'bot') {
        last.text = text
      }
    },

    appendToLastBotMessage(token: string) {
      const last = this.messages[this.messages.length - 1]
      if (last && last.type === 'bot') {
        last.text += token
      }
    },

    addRetryMessage(seconds: number): number {
      this.messages.push({
        text: `⚠️ Too many requests. Try again in ${seconds} seconds.`,
        type: 'bot',
        isMarkdown: false,
        timestamp: Date.now()
      })
      return this.messages.length - 1
    },

    updateRetryMessage(index: number, text: string) {
      if (this.messages[index]) {
        this.messages[index].text = text
      }
    },

    // ── Multi-conversation support ──

    _loadConversations() {
      try {
        const saved = localStorage.getItem(CONVERSATIONS_STORAGE_KEY)
        if (saved) {
          this.conversations = JSON.parse(saved)
        }
      } catch {
        this.conversations = []
      }
    },

    _saveConversations() {
      localStorage.setItem(CONVERSATIONS_STORAGE_KEY, JSON.stringify(this.conversations))
    },

    /** Save current conversation to the list before switching */
    saveCurrentConversation() {
      if (!this.threadId || this.messages.length <= 1) return

      const firstUserMsg = this.messages.find(m => m.type === 'user')
      const title = firstUserMsg?.text.slice(0, 50) || 'New conversation'

      const existing = this.conversations.find(c => c.threadId === this.threadId)
      if (existing) {
        existing.title = title
        existing.updatedAt = Date.now()
      } else {
        this.conversations.unshift({
          id: globalThis.crypto.randomUUID(),
          threadId: this.threadId,
          title,
          createdAt: Date.now(),
          updatedAt: Date.now()
        })
        // Keep max 20 conversations
        if (this.conversations.length > 20) {
          this.conversations = this.conversations.slice(0, 20)
        }
      }
      this._saveConversations()
    },

    /** Switch to an existing conversation */
    async switchConversation(threadId: string) {
      // Save current first
      this.saveCurrentConversation()

      this.threadId = threadId
      this.messages = []
      this.historyLoaded = false
      localStorage.setItem(THREAD_STORAGE_KEY, threadId)
      localStorage.removeItem(FEEDBACK_STORAGE_KEY)
      await this.fetchHistory()
      this.historyLoaded = true
    },

    deleteConversation(threadId: string) {
      this.conversations = this.conversations.filter(c => c.threadId !== threadId)
      this._saveConversations()
      localStorage.removeItem(`${FEEDBACK_STORAGE_KEY}_${threadId}`)

      // If deleting the active conversation, reset directly (don't re-save)
      if (this.threadId === threadId) {
        this.messages = []
        this.threadId = null
        this.historyLoaded = false
        localStorage.removeItem(THREAD_STORAGE_KEY)
      }
    },

    clearChat() {
      // Save current before clearing
      this.saveCurrentConversation()

      this.messages = []
      this.threadId = null
      this.historyLoaded = false
      localStorage.removeItem(THREAD_STORAGE_KEY)
      localStorage.removeItem(FEEDBACK_STORAGE_KEY)
    },

    // ── Feedback persistence ──

    _feedbackKey(): string {
      return this.threadId ? `${FEEDBACK_STORAGE_KEY}_${this.threadId}` : FEEDBACK_STORAGE_KEY
    },

    _saveFeedback() {
      const feedbackMap: Record<number, 'up' | 'down'> = {}
      this.messages.forEach((msg, i) => {
        if (msg.feedback) feedbackMap[i] = msg.feedback
      })
      localStorage.setItem(this._feedbackKey(), JSON.stringify(feedbackMap))
    },

    _restoreFeedback() {
      try {
        const saved = localStorage.getItem(this._feedbackKey())
        if (!saved) return
        const feedbackMap = JSON.parse(saved) as Record<number, 'up' | 'down'>
        for (const [idx, rating] of Object.entries(feedbackMap)) {
          const i = parseInt(idx, 10)
          if (this.messages[i]) {
            this.messages[i].feedback = rating
          }
        }
      } catch {
        // Ignore corrupt data
      }
    },

    // ── Export ──

    async exportChat() {
      const cleanForPdf = (text: string): string => {
        return (
          text
            // Strip markdown
            .replace(/^#{1,6}\s+/gm, '')
            .replace(/\*\*(.+?)\*\*/g, '$1')
            .replace(/\*(.+?)\*/g, '$1')
            .replace(/__(.+?)__/g, '$1')
            .replace(/_(.+?)_/g, '$1')
            .replace(/`(.+?)`/g, '$1')
            .replace(/\[(.+?)\]\(.+?\)/g, '$1')
            .replace(/^[-*+]\s+/gm, '  - ')
            .replace(/^\d+\.\s+/gm, m => `  ${m}`)
            .replace(/^>\s+/gm, '  ')
            .replace(/---+/g, '')
            .replace(/【[^】]+】/g, '')
            .replace(/\[(\d+):(\d+)†[^\]]+\]/g, '')
            // Replace common emojis with text equivalents
            .replace(/🤖/g, '[Bot]')
            .replace(/⚖️?/g, '[Law]')
            .replace(/👤/g, '[User]')
            .replace(/⚠️?/g, '[!]')
            .replace(/📄/g, '[Doc]')
            .replace(/🧑‍⚖️/g, '[Judge]')
            .replace(/💬/g, '[Chat]')
            .replace(/🎮/g, '[Game]')
            // Remove any remaining emojis and special unicode
            /* eslint-disable no-misleading-character-class */
            .replace(
              /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{FE00}-\u{FE0F}\u{200D}\u{20E3}\u{E0020}-\u{E007F}]/gu,
              ''
            )
            /* eslint-enable no-misleading-character-class */
            // Clean up extra whitespace from removals
            .replace(/  +/g, ' ')
            .trim()
        )
      }

      const { jsPDF } = await import('jspdf')
      const doc = new jsPDF()
      const pageWidth = doc.internal.pageSize.getWidth()
      const margin = 15
      const maxWidth = pageWidth - margin * 2
      let y = 20

      doc.setFontSize(16)
      doc.setFont('helvetica', 'bold')
      doc.text('CaseBot Conversation', margin, y)
      y += 8

      doc.setFontSize(9)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(120)
      doc.text(`Exported: ${new Date().toLocaleString()}`, margin, y)
      y += 10

      doc.setDrawColor(200)
      doc.line(margin, y, pageWidth - margin, y)
      y += 8

      for (const msg of this.messages) {
        const role = msg.type === 'user' ? 'You' : 'CaseBot'
        const time = msg.timestamp ? new Date(msg.timestamp).toLocaleString() : ''

        if (y > doc.internal.pageSize.getHeight() - 30) {
          doc.addPage()
          y = 20
        }

        doc.setFontSize(10)
        doc.setFont('helvetica', 'bold')
        doc.setTextColor(
          msg.type === 'user' ? 37 : 0,
          msg.type === 'user' ? 99 : 51,
          msg.type === 'user' ? 235 : 153
        )
        doc.text(`${role}${time ? '  ·  ' + time : ''}`, margin, y)
        y += 6

        doc.setFontSize(10)
        doc.setFont('helvetica', 'normal')
        doc.setTextColor(50)
        const lines = doc.splitTextToSize(cleanForPdf(msg.text), maxWidth)
        for (const line of lines) {
          if (y > doc.internal.pageSize.getHeight() - 15) {
            doc.addPage()
            y = 20
          }
          doc.text(line, margin, y)
          y += 5
        }

        y += 6
        doc.setDrawColor(230)
        doc.line(margin, y, pageWidth - margin, y)
        y += 8
      }

      doc.save(`casebot-chat-${new Date().toISOString().slice(0, 10)}.pdf`)
    }
  }
})
