<template>
  <NuxtLayout name="default">
    <template #sub-menu>
      <ClientOnly><ChatHistoryPanel @new-chat="newChat" @switch="switchTo" /></ClientOnly>
    </template>

    <ClientOnly>
      <ChatMobileSidebar
        v-model="mobileSidebar"
        @new-chat="handleMobileNewChat"
        @switch="handleMobileSwitch"
      />
    </ClientOnly>

    <div class="chat-container">
      <div class="chat-header">
        <div class="header-info">
          <button
            class="sidebar-toggle lg:hidden"
            title="Chat history"
            @click="mobileSidebar = !mobileSidebar"
          >
            <svg viewBox="0 0 24 24" width="20" height="20">
              <path fill="currentColor" d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
            </svg>
          </button>
          <h1>🧑‍⚖️ CaseBot - AI Legal Assistant</h1>
          <p class="subtitle">Ask detailed legal questions and get comprehensive answers</p>
        </div>
        <div class="header-actions">
          <button class="header-btn" title="New chat" @click="newChat">
            <svg viewBox="0 0 24 24" width="16" height="16">
              <path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
            </svg>
            New Chat
          </button>
          <button
            class="header-btn"
            title="Export conversation"
            :disabled="store.messages.length <= 1"
            @click="store.exportChat()"
          >
            <svg viewBox="0 0 24 24" width="16" height="16">
              <path fill="currentColor" d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
            </svg>
            Export
          </button>
        </div>
      </div>

      <div class="messages-area" ref="messagesContainer">
        <div v-if="store.messages.length <= 1 && !store.isLoading" class="starter-questions">
          <p class="starter-label">Try asking:</p>
          <div class="starter-chips">
            <button
              v-for="q in starterQuestions"
              :key="q"
              class="starter-chip"
              @click="sendMessage(q)"
            >
              {{ q }}
            </button>
          </div>
        </div>

        <div
          v-for="(message, index) in store.messages"
          :key="index"
          :class="['message-wrapper', message.type]"
        >
          <span class="avatar">{{ message.type === 'bot' ? '&#9878;&#65039;' : '&#128100;' }}</span>
          <div class="message-bubble">
            <div
              v-if="message.isMarkdown"
              class="markdown-body"
              v-html="sanitizeHtml(renderMessage(message.text))"
            ></div>
            <div v-else class="message-text">{{ message.text }}</div>
            <div v-if="message.sources?.length" class="sources-panel">
              <details>
                <summary>
                  {{ message.sources.length }} source{{ message.sources.length > 1 ? 's' : '' }}
                </summary>
                <div v-for="(src, i) in message.sources" :key="i" class="source-item">
                  <strong>[{{ i + 1 }}] {{ src.filename }}</strong>
                  <p v-if="src.quote" class="source-quote">{{ src.quote }}</p>
                </div>
              </details>
            </div>
            <div class="message-meta">
              <span v-if="message.timestamp" class="msg-time">
                {{ formatTime(message.timestamp) }}
              </span>
              <button
                v-if="message.type === 'bot' && message.text"
                class="copy-btn"
                :title="copiedIdx === index ? 'Copied' : 'Copy message'"
                @click="copyMessage(message.text, index)"
              >
                <svg v-if="copiedIdx !== index" viewBox="0 0 24 24" width="16" height="16">
                  <path
                    fill="currentColor"
                    d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"
                  />
                </svg>
                <svg v-else viewBox="0 0 24 24" width="16" height="16">
                  <path
                    fill="currentColor"
                    d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"
                  />
                </svg>
              </button>
            </div>
            <div
              v-if="message.type === 'bot' && message.text && !message.text.startsWith('⚠️')"
              class="feedback-btns"
            >
              <button
                :class="['fb-btn', { active: message.feedback === 'up' }]"
                title="Helpful"
                @click="sendFeedback(index, 'up')"
              >
                <svg viewBox="0 0 24 24" width="16" height="16">
                  <path
                    fill="currentColor"
                    d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z"
                  />
                </svg>
              </button>
              <button
                :class="['fb-btn', { active: message.feedback === 'down' }]"
                title="Not helpful"
                @click="sendFeedback(index, 'down')"
              >
                <svg viewBox="0 0 24 24" width="16" height="16">
                  <path
                    fill="currentColor"
                    d="M15 3H6c-.83 0-1.54.5-1.84 1.22l-3.02 7.05c-.09.23-.14.47-.14.73v2c0 1.1.9 2 2 2h6.31l-.95 4.57-.03.32c0 .41.17.79.44 1.06L9.83 23l6.59-6.59c.36-.36.58-.86.58-1.41V5c0-1.1-.9-2-2-2zm4 0v12h4V3h-4z"
                  />
                </svg>
              </button>
            </div>
          </div>
          <div v-if="message.followups?.length" class="followup-chips">
            <button
              v-for="q in message.followups"
              :key="q"
              class="followup-chip"
              @click="sendMessage(q)"
            >
              {{ q }}
            </button>
          </div>
        </div>

        <div v-if="store.isLoading" class="loading-indicator">
          <div class="typing-indicator">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <span>CaseBot is thinking...</span>
        </div>
      </div>

      <div
        v-if="userInput.length > 400"
        class="char-counter"
        :class="{ over: userInput.length > 500 }"
      >
        {{ userInput.length }}/500
      </div>
      <div class="input-area">
        <textarea
          v-model="userInput"
          placeholder="Type your legal question here... (Press Ctrl+Enter to send)"
          class="chat-textarea"
          rows="3"
          maxlength="500"
          @keydown.ctrl.enter="sendMessage"
          @keydown.meta.enter="sendMessage"
        ></textarea>
        <button
          @click="sendMessage"
          @keydown.enter="sendMessage"
          @keydown.space="sendMessage"
          class="send-button"
          :disabled="store.isLoading || !userInput.trim()"
          aria-label="Send message"
        >
          <svg v-if="!store.isLoading" viewBox="0 0 24 24" width="24" height="24">
            <path fill="currentColor" d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
          </svg>
          <span v-if="store.isLoading">Sending...</span>
          <span v-else>Send</span>
        </button>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, watch } from 'vue'
import { useSanitize } from '~/composables/useSanitize'
import { useMarkdown } from '~/composables/useMarkdown'
import { useCasebotStore } from '~/stores/casebot-store'
import { useStreamingChat } from '~/composables/useStreamingChat'

definePageMeta({
  title: 'AI Legal Assistant',
  description: 'Chat with CaseBot AI for comprehensive legal assistance',
  layout: false
})

const { sanitizeHtml } = useSanitize()
const { parseMarkdown } = useMarkdown()
const store = useCasebotStore()
const { streamChat } = useStreamingChat()
const userInput = ref('')
const mobileSidebar = ref(false)
const messagesContainer = ref<HTMLElement | null>(null)
const copiedIdx = ref<number | null>(null)
const starterQuestions = [
  "What are a defendant's rights in nUSA?",
  'How do I appeal a court ruling?',
  'Explain the nUSA Constitution'
]

const switchTo = async (threadId: string) => {
  await store.switchConversation(threadId)
  scrollToBottom()
}

const handleMobileNewChat = () => {
  newChat()
  mobileSidebar.value = false
}

const handleMobileSwitch = async (threadId: string) => {
  await switchTo(threadId)
  mobileSidebar.value = false
}

const newChat = () => {
  store.clearChat()
  store.addMessage({
    text: 'Hello! I am CaseBot 🤖, your AI legal assistant. I can help you with legal questions, explain laws and procedures, and provide guidance on nUSA legal matters. What would you like to know?',
    type: 'bot',
    isMarkdown: false
  })
}

const copyMessage = async (text: string, index: number) => {
  await navigator.clipboard.writeText(text)
  copiedIdx.value = index
  setTimeout(() => {
    copiedIdx.value = null
  }, 2000)
}

const formatTime = (ts: number): string => {
  const seconds = Math.floor((Date.now() - ts) / 1000)
  if (seconds < 60) return 'just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

const sendFeedback = async (index: number, rating: 'up' | 'down') => {
  const msg = store.messages[index]
  if (!msg) return
  msg.feedback = rating
  store._saveFeedback()
  try {
    await fetch('/api/chatbot-feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        thread_id: store.threadId,
        message_index: index,
        rating,
        message_preview: msg.text.slice(0, 100)
      })
    })
  } catch {
    // Feedback is best-effort
  }
}

onMounted(async () => {
  await store.init()
  if (store.messages.length === 0) {
    store.addMessage({
      text: 'Hello! I am CaseBot 🤖, your AI legal assistant. I can help you with legal questions, explain laws and procedures, and provide guidance on nUSA legal matters. What would you like to know?',
      type: 'bot',
      isMarkdown: false
    })
  }
  scrollToBottom()
})

watch(
  () => store.messages,
  () => {
    scrollToBottom()
  },
  { deep: true }
)

const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

const renderMessage = (text: string): string => {
  const { html } = parseMarkdown(text)
  return html
}

const sendMessage = async (prefill?: string | Event) => {
  const text = (typeof prefill === 'string' ? prefill : userInput.value).trim()
  if (!text || store.isLoading) return

  store.addMessage({ text, type: 'user', isMarkdown: false })
  userInput.value = ''
  scrollToBottom()

  await streamChat(text, scrollToBottom)
  store.saveCurrentConversation()
  scrollToBottom()
}
</script>

<style scoped>
.chat-container {
  background: white;
  border-radius: 1rem;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  height: calc(100dvh - 7rem);
}

[data-theme='dark'] .chat-container {
  background: #1a1a1a;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6);
}

.chat-header {
  background: linear-gradient(135deg, #003366 0%, #0055aa 100%);
  color: white;
  padding: 1rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.header-info {
  flex: 1;
}

[data-theme='dark'] .chat-header {
  background: linear-gradient(135deg, #1e3a8a 0%, #003366 100%);
}

.chat-header h1 {
  margin: 0 0 0.25rem 0;
  font-size: 2rem;
  font-weight: 700;
}

.header-actions {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}

.header-btn {
  background: rgba(255, 255, 255, 0.15);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 6px;
  padding: 6px 14px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: background 0.2s;
  display: flex;
  align-items: center;
  gap: 6px;
}

.header-btn:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.25);
}

.header-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.subtitle {
  margin: 0;
  opacity: 0.95;
  font-size: 1rem;
}

.messages-area {
  flex: 1;
  overflow-y: auto;
  padding: 2rem;
  background: #f8f9fa;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

[data-theme='dark'] .messages-area {
  background: #2d2d2d;
}

.message-wrapper {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  gap: 10px;
  align-items: flex-start;
}

.message-wrapper.user {
  justify-content: flex-end;
}

.message-wrapper.bot {
  justify-content: flex-start;
}

.message-bubble {
  max-width: 70%;
  padding: 1rem 1.5rem;
  border-radius: 1rem;
  word-wrap: break-word;
  line-height: 1.6;
}

.user .message-bubble {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-bottom-right-radius: 0.25rem;
}

.bot .message-bubble {
  background: white;
  color: #1a202c;
  border: 1px solid #e2e8f0;
  border-bottom-left-radius: 0.25rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

[data-theme='dark'] .bot .message-bubble {
  background: #3a3a3a;
  color: #e2e8f0;
  border-color: #4a4a4a;
}

.message-text {
  white-space: pre-wrap;
}

.message-bubble :deep(h1),
.message-bubble :deep(h2),
.message-bubble :deep(h3) {
  margin: 1rem 0 0.5rem 0;
  font-weight: 600;
}

.message-bubble :deep(h1:first-child),
.message-bubble :deep(h2:first-child),
.message-bubble :deep(h3:first-child) {
  margin-top: 0;
}

.message-bubble :deep(h1) {
  font-size: 1.5rem;
}

.message-bubble :deep(h2) {
  font-size: 1.25rem;
}

.message-bubble :deep(h3) {
  font-size: 1.1rem;
}

.message-bubble :deep(p) {
  margin: 0.75rem 0;
}

.message-bubble :deep(p:first-child) {
  margin-top: 0;
}

.message-bubble :deep(p:last-child) {
  margin-bottom: 0;
}

.message-bubble :deep(li) {
  margin: 0.5rem 0;
}

.message-bubble :deep(strong) {
  font-weight: 600;
}

.message-bubble :deep(em) {
  font-style: italic;
}

.message-bubble :deep(a) {
  color: #2563eb;
  text-decoration: underline;
}

.message-bubble :deep(a:hover) {
  color: #1e40af;
}

.user .message-bubble :deep(a) {
  color: #fde68a;
}

.user .message-bubble :deep(a:hover) {
  color: #fef3c7;
}

[data-theme='dark'] .bot .message-bubble :deep(a) {
  color: #60a5fa;
}

[data-theme='dark'] .bot .message-bubble :deep(a:hover) {
  color: #93c5fd;
}

.loading-indicator {
  display: flex;
  align-items: center;
  gap: 1rem;
  color: #64748b;
  font-size: 0.875rem;
}

.typing-indicator {
  display: flex;
  align-items: center;
  gap: 4px;
}

.typing-indicator span {
  width: 8px;
  height: 8px;
  background: #667eea;
  border-radius: 50%;
  animation: typingBounce 1.4s infinite ease-in-out both;
}

.typing-indicator span:nth-child(1) {
  animation-delay: -0.32s;
}

.typing-indicator span:nth-child(2) {
  animation-delay: -0.16s;
}

@keyframes typingBounce {
  0%,
  80%,
  100% {
    transform: scale(0);
    opacity: 0.5;
  }

  40% {
    transform: scale(1);
    opacity: 1;
  }
}

.input-area {
  padding: 1.5rem;
  background: white;
  border-top: 1px solid #e2e8f0;
  display: flex;
  gap: 1rem;
  align-items: flex-end;
}

[data-theme='dark'] .input-area {
  background: #1a1a1a;
  border-top-color: #3a3a3a;
}

.chat-textarea {
  flex: 1;
  padding: 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-family: inherit;
  resize: vertical;
  min-height: 60px;
  max-height: 200px;
  outline: none;
  transition: border-color 0.2s;
}

.chat-textarea:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

[data-theme='dark'] .chat-textarea {
  background: #2d2d2d;
  color: #e2e8f0;
  border-color: #4a4a4a;
}

[data-theme='dark'] .chat-textarea:focus {
  border-color: #667eea;
}

.send-button {
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.send-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.send-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.send-button svg {
  width: 20px;
  height: 20px;
}

.sources-panel {
  margin-top: 8px;
  font-size: 0.8rem;
}

.sources-panel summary {
  cursor: pointer;
  color: #6b7280;
  font-size: 0.75rem;
}

.sources-panel ul {
  margin: 4px 0 0;
  padding-left: 1.2em;
  color: #6b7280;
}

.source-item {
  font-size: 0.8rem;
  margin: 8px 0;
  padding: 6px 0;
  border-bottom: 1px solid #e5e7eb;
}

.source-item:last-child {
  border-bottom: none;
}

.source-quote {
  margin: 4px 0 0;
  padding: 6px 10px;
  border-left: 2px solid #d1d5db;
  color: #6b7280;
  font-size: 0.8rem;
  font-style: italic;
  line-height: 1.5;
}

[data-theme='dark'] .source-item {
  border-bottom-color: #4a4a4a;
}

[data-theme='dark'] .source-quote {
  border-left-color: #4a4a4a;
  color: #9ca3af;
}

[data-theme='dark'] .sources-panel summary,
[data-theme='dark'] .sources-panel ul {
  color: #9ca3af;
}

.citation {
  color: #2563eb;
  cursor: help;
  font-size: 0.75em;
}

[data-theme='dark'] .citation {
  color: #60a5fa;
}

.followup-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
  width: 100%;
  justify-content: flex-start;
}

.followup-chip {
  background: #e0e7ff;
  color: #3730a3;
  border: 1px solid #c7d2fe;
  border-radius: 20px;
  padding: 6px 16px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
}

.followup-chip:hover {
  background: #c7d2fe;
  transform: translateY(-1px);
}

[data-theme='dark'] .followup-chip {
  background: #312e81;
  color: #c7d2fe;
  border-color: #3730a3;
}

[data-theme='dark'] .followup-chip:hover {
  background: #3730a3;
}

.message-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid #e5e7eb;
  font-size: 0.7rem;
  color: #9ca3af;
}

[data-theme='dark'] .message-meta {
  border-top-color: #4a4a4a;
}

.msg-time {
  opacity: 0.7;
}

.copy-btn {
  background: none;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  opacity: 0;
  transition:
    opacity 0.2s,
    background 0.2s;
  display: flex;
  align-items: center;
}

.message-bubble:hover .copy-btn {
  opacity: 1;
}

.copy-btn:hover {
  background: rgba(0, 0, 0, 0.05);
  color: #6b7280;
}

[data-theme='dark'] .copy-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #d1d5db;
}

.char-counter {
  text-align: right;
  font-size: 0.75rem;
  color: #9ca3af;
  padding: 0 1.5rem;
}

.char-counter.over {
  color: #ef4444;
}

.avatar {
  font-size: 24px;
  flex-shrink: 0;
  width: 32px;
  text-align: center;
  line-height: 1;
  margin-top: 0.5rem;
}

.starter-questions {
  padding: 1rem 0;
  text-align: center;
}

.starter-label {
  font-size: 0.9rem;
  color: #9ca3af;
  margin: 0 0 0.75rem;
}

.starter-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
}

.starter-chip {
  background: #f0f9ff;
  color: #0369a1;
  border: 1px solid #bae6fd;
  border-radius: 16px;
  padding: 8px 18px;
  font-size: 0.875rem;
  cursor: pointer;
  text-align: left;
  transition: all 0.2s;
}

.starter-chip:hover {
  background: #e0f2fe;
  transform: translateY(-1px);
}

[data-theme='dark'] .starter-chip {
  background: #1e3a5f;
  color: #7dd3fc;
  border-color: #1e3a5f;
}

[data-theme='dark'] .starter-chip:hover {
  background: #1e4976;
}

.feedback-btns {
  display: flex;
  gap: 4px;
  margin-top: 6px;
}

.fb-btn {
  background: none;
  border: none;
  color: #d1d5db;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  transition: color 0.2s;
}

.fb-btn:hover {
  color: #6b7280;
}

.fb-btn.active {
  color: #2563eb;
}

[data-theme='dark'] .fb-btn:hover {
  color: #9ca3af;
}

[data-theme='dark'] .fb-btn.active {
  color: #60a5fa;
}

.sidebar-toggle {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
}

@media (max-width: 768px) {
  .chat-container {
    border-radius: 0;
    height: calc(100dvh - 6rem);
  }

  .chat-header h1 {
    font-size: 1.2rem;
  }

  .subtitle {
    display: none;
  }

  .messages-area {
    padding: 1rem;
  }

  .message-bubble {
    max-width: 85%;
  }

  .input-area {
    padding: 1rem;
  }

  .send-button {
    padding: 0.75rem 1.5rem;
  }
}
</style>

<style>
.messages-area .markdown-body ol {
  list-style-type: decimal !important;
  margin: 0.75rem 0;
  padding-left: 1.5rem;
}

.messages-area .markdown-body ul {
  list-style-type: disc !important;
  margin: 0.75rem 0;
  padding-left: 1.5rem;
}

.messages-area .markdown-body {
  overflow-x: auto;
}

.messages-area .markdown-body table {
  border-collapse: collapse;
  width: max-content;
  min-width: 100%;
  margin: 0.75rem 0;
  font-size: 0.875rem;
}

.messages-area .markdown-body th,
.messages-area .markdown-body td {
  border: 1px solid #d1d5db;
  padding: 8px 12px;
  text-align: left;
}

.messages-area .markdown-body th {
  background: #f3f4f6;
  font-weight: 600;
}

[data-theme='dark'] .messages-area .markdown-body th,
[data-theme='dark'] .messages-area .markdown-body td {
  border-color: #4a4a4a;
}

[data-theme='dark'] .messages-area .markdown-body th {
  background: #374151;
}
</style>
