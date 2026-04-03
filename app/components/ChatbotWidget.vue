<template>
  <div v-if="shouldShowChatbot">
    <button
      id="chat-toggle-btn"
      @click="toggleChat"
      @keydown.enter="toggleChat"
      @keydown.space="toggleChat"
      :title="isOpen ? 'Close chat' : 'Open chat'"
      :aria-label="isOpen ? 'Close chat' : 'Open chat'"
      :aria-expanded="isOpen"
    >
      💬
    </button>

    <div v-if="isOpen" id="chat-container" role="region" aria-label="Chatbot window">
      <div id="chat-header">
        <span>🧑‍⚖️ nUSA Legal Assistant</span>
        <div class="header-actions">
          <button class="header-btn" title="Minimize" @click="isOpen = false">
            <svg viewBox="0 0 24 24" width="18" height="18">
              <path fill="currentColor" d="M19 13H5v-2h14v2z" />
            </svg>
          </button>
          <button class="header-btn" title="New chat" @click="newChat">
            <svg viewBox="0 0 24 24" width="18" height="18">
              <path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
            </svg>
          </button>
          <NuxtLink to="/ai-chat" class="header-btn" title="Open full-page chat">
            <svg viewBox="0 0 24 24" width="18" height="18">
              <path
                fill="currentColor"
                d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"
              />
            </svg>
          </NuxtLink>
        </div>
      </div>

      <div id="chat-messages" ref="messagesContainer" aria-live="polite">
        <div v-if="store.messages.length <= 1 && !store.isLoading" class="starter-questions">
          <p class="starter-label">Try asking:</p>
          <button
            v-for="q in starterQuestions"
            :key="q"
            class="starter-chip"
            @click="sendMessage(q)"
          >
            {{ q }}
          </button>
        </div>

        <div
          v-for="(message, index) in store.messages"
          :key="index"
          :class="['message', message.type]"
          role="log"
        >
          <div class="msg-label">
            <span v-if="message.type === 'bot'" class="label-bot">
              &#9878;&#65039; nUSA Legal Assistant
            </span>
            <span v-else class="label-user">&#128100; You</span>
          </div>
          <div
            v-if="message.isMarkdown"
            class="markdown-body"
            v-html="sanitizeHtml(renderMessage(message.text))"
          ></div>
          <div v-else>{{ message.text }}</div>
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
              @click="copyMessage(message.text)"
            >
              <svg v-if="copiedIdx !== index" viewBox="0 0 24 24" width="14" height="14">
                <path
                  fill="currentColor"
                  d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"
                />
              </svg>
              <svg v-else viewBox="0 0 24 24" width="14" height="14">
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
              <svg viewBox="0 0 24 24" width="14" height="14">
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
              <svg viewBox="0 0 24 24" width="14" height="14">
                <path
                  fill="currentColor"
                  d="M15 3H6c-.83 0-1.54.5-1.84 1.22l-3.02 7.05c-.09.23-.14.47-.14.73v2c0 1.1.9 2 2 2h6.31l-.95 4.57-.03.32c0 .41.17.79.44 1.06L9.83 23l6.59-6.59c.36-.36.58-.86.58-1.41V5c0-1.1-.9-2-2-2zm4 0v12h4V3h-4z"
                />
              </svg>
            </button>
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

        <div v-if="store.isLoading" class="typing-indicator">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>

      <div
        v-if="userInput.length > 400"
        class="char-counter"
        :class="{ over: userInput.length > 500 }"
      >
        {{ userInput.length }}/500
      </div>
      <div id="chat-input">
        <input
          v-model="userInput"
          type="text"
          id="query-input"
          placeholder="Ask your legal question..."
          autocomplete="off"
          aria-label="Chat input"
          :maxlength="500"
          @keyup.enter="sendMessage"
        />
        <button
          id="send-btn"
          @click="sendMessage"
          @keydown.enter="sendMessage"
          @keydown.space="sendMessage"
          aria-label="Send message"
          type="button"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useSanitize } from '~/composables/useSanitize'
import { useMarkdown } from '~/composables/useMarkdown'
import { useCasebotStore } from '~/stores/casebot-store'
import { useStreamingChat } from '~/composables/useStreamingChat'
const route = useRoute()
const { sanitizeHtml } = useSanitize()
const { parseMarkdown } = useMarkdown()
const store = useCasebotStore()
const { streamChat } = useStreamingChat()
const isOpen = ref(false)
const userInput = ref('')
const messagesContainer = ref<HTMLElement | null>(null)

const isOnMockTrialPage = computed(() => {
  return route.path.includes('mock-trial')
})

const shouldShowChatbot = computed(() => {
  return !isOnMockTrialPage.value
})

const copiedIdx = ref<number | null>(null)
const starterQuestions = [
  "What are a defendant's rights in nUSA?",
  'How do I appeal a court ruling?',
  'Explain the nUSA Constitution'
]

onMounted(async () => {
  await store.init()
})

const newChat = () => {
  store.clearChat()
  store.addMessage({
    text: 'Hello! I am nUSA Legal Assistant 🤖. Ask me your legal questions.',
    type: 'bot',
    isMarkdown: false
  })
}

const copyMessage = async (text: string) => {
  await navigator.clipboard.writeText(text)
  const idx = store.messages.findIndex(m => m.text === text)
  copiedIdx.value = idx
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

watch(
  () => store.messages,
  () => {
    if (isOpen.value) scrollToBottom()
  },
  { deep: true }
)

const toggleChat = () => {
  isOpen.value = !isOpen.value

  if (isOpen.value) {
    scrollToBottom()
  }

  if (isOpen.value && store.messages.length === 0) {
    store.addMessage({
      text: 'Hello! I am nUSA Legal Assistant 🤖. Ask me your legal questions.',
      type: 'bot',
      isMarkdown: false
    })
  }
}

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

const isQuestionValid = (input: string): { valid: boolean; reason?: string } => {
  if (!input || !input.trim()) return { valid: false, reason: 'Please enter a question.' }
  if (input.trim().length < 3)
    return { valid: false, reason: 'Your question is too short. Please provide more detail.' }
  if (input.trim().length > 500)
    return {
      valid: false,
      reason: 'Your question is too long. Please keep it under 500 characters.'
    }
  return { valid: true }
}

const sendMessage = async (prefill?: string | Event) => {
  const text = (typeof prefill === 'string' ? prefill : userInput.value).trim()
  if (!text || store.isLoading) return

  const validation = isQuestionValid(text)
  if (!validation.valid) {
    store.addMessage({ text: `⚠️ ${validation.reason}`, type: 'bot', isMarkdown: false })
    scrollToBottom()
    return
  }

  store.addMessage({ text, type: 'user', isMarkdown: false })
  userInput.value = ''
  scrollToBottom()

  await streamChat(text, scrollToBottom)
  scrollToBottom()
}
</script>

<style scoped>
#chat-toggle-btn {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 56px;
  height: 56px;
  background: #003366;
  border-radius: 50%;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  cursor: pointer;
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 28px;
  user-select: none;
  border: none;
  transition: background 0.3s ease;
}

#chat-toggle-btn:hover {
  background: #0055aa;
  transform: scale(1.05);
}

[data-theme='dark'] #chat-toggle-btn {
  background: linear-gradient(135deg, #1e3a8a 0%, #003366 100%);
  box-shadow: 0 4px 12px rgba(30, 58, 138, 0.4);
}

[data-theme='dark'] #chat-toggle-btn:hover {
  background: linear-gradient(135deg, #2563eb 0%, #0055aa 100%);
  box-shadow: 0 6px 16px rgba(37, 99, 235, 0.5);
}

#chat-container {
  position: fixed;
  bottom: 90px;
  right: 20px;
  width: 380px;
  height: 560px;
  min-width: 300px;
  min-height: 400px;
  max-width: 90vw;
  max-height: 80vh;
  resize: both;
  overflow: hidden;
  background: #ffffff;
  border: 1px solid #ccc;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  font-family: Arial, sans-serif;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  z-index: 9999;
}

[data-theme='dark'] #chat-container {
  background: #1a1a1a;
  border-color: #3a3a3a;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
}

#chat-header {
  background: #003366;
  color: white;
  padding: 12px;
  font-size: 16px;
  font-weight: bold;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
}

[data-theme='dark'] #chat-header {
  background: linear-gradient(135deg, #1e3a8a 0%, #003366 100%);
}

.header-actions {
  display: flex;
  gap: 4px;
  align-items: center;
}

.header-btn {
  color: white;
  display: flex;
  align-items: center;
  padding: 4px;
  border-radius: 4px;
  transition: background 0.2s ease;
  text-decoration: none;
  background: none;
  border: none;
  cursor: pointer;
}

.header-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

#chat-messages {
  flex: 1 1 auto;
  padding: 10px;
  overflow-y: auto;
  font-size: 14px;
  background: #fafafa;
}

[data-theme='dark'] #chat-messages {
  background: #2d2d2d;
}

.message {
  margin: 6px 0;
  padding: 8px 12px;
  border-radius: 16px;
  max-width: 90%;
  clear: both;
  word-wrap: break-word;
}

.msg-label {
  font-size: 10px;
  font-weight: 600;
  color: #6b7280;
  margin-bottom: 2px;
}

.label-bot {
  font-size: 13px;
}

[data-theme='dark'] .msg-label {
  color: #9ca3af;
}

.starter-questions {
  padding: 8px 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.starter-label {
  font-size: 12px;
  color: #9ca3af;
  margin: 0;
}

.starter-chip {
  background: #f0f9ff;
  color: #0369a1;
  border: 1px solid #bae6fd;
  border-radius: 12px;
  padding: 6px 12px;
  font-size: 12px;
  cursor: pointer;
  text-align: left;
  transition: background 0.2s;
}

.starter-chip:hover {
  background: #e0f2fe;
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
  margin-top: 4px;
}

.fb-btn {
  background: none;
  border: none;
  color: #d1d5db;
  cursor: pointer;
  padding: 2px;
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

.user {
  background: #e1f5fe;
  align-self: flex-end;
  margin-left: auto;
  color: #000;
}

[data-theme='dark'] .user {
  background: #1a365d;
  color: #e2e8f0;
}

.bot {
  background: #f1f1f1;
  align-self: flex-start;
  margin-right: auto;
  color: #000;
}

[data-theme='dark'] .bot {
  background: #2d3748;
  color: #e2e8f0;
}

.message :deep(h1),
.message :deep(h2),
.message :deep(h3) {
  margin: 0.5em 0 0.3em 0;
  font-weight: bold;
}

.message :deep(h1) {
  font-size: 1.4em;
}

.message :deep(h2) {
  font-size: 1.2em;
}

.message :deep(h3) {
  font-size: 1.1em;
}

.message :deep(p) {
  margin: 0.5em 0;
}

.message li {
  margin: 0.3em 0;
}

.message :deep(strong) {
  font-weight: bold;
}

.message :deep(em) {
  font-style: italic;
}

.message :deep(a) {
  color: #2563eb;
  text-decoration: underline;
}

.message :deep(a:hover) {
  color: #1e40af;
}

[data-theme='dark'] .message :deep(a) {
  color: #60a5fa;
}

[data-theme='dark'] .message :deep(a:hover) {
  color: #93c5fd;
}

#chat-input {
  display: flex;
  border-top: 1px solid #ccc;
  padding: 8px;
  flex-shrink: 0;
  background: white;
  gap: 8px;
  align-items: center;
}

[data-theme='dark'] #chat-input {
  background: #1a1a1a;
  border-top-color: #3a3a3a;
}

#query-input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
  outline: none;
  background: white;
  color: #333;
}

[data-theme='dark'] #query-input {
  background: #2d2d2d;
  color: #e0e0e0;
  border-color: #3a3a3a;
}

#send-btn {
  background: #003366;
  border: none;
  padding: 8px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.3s ease;
  width: 36px;
  height: 36px;
  color: white;
}

#send-btn:hover {
  background: #0055aa;
  transform: scale(1.05);
}

[data-theme='dark'] #send-btn {
  background: linear-gradient(135deg, #1e3a8a 0%, #003366 100%);
}

[data-theme='dark'] #send-btn:hover {
  background: linear-gradient(135deg, #2563eb 0%, #0055aa 100%);
}

#send-btn svg {
  width: 20px;
  height: 20px;
  fill: white;
}

.typing-indicator {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px 12px;
  background: #f1f1f1;
  border-radius: 16px;
  width: fit-content;
}

[data-theme='dark'] .typing-indicator {
  background: #2d3748;
}

.typing-indicator span {
  width: 8px;
  height: 8px;
  background: #003366;
  border-radius: 50%;
  animation: typingBounce 1.4s infinite ease-in-out both;
}

[data-theme='dark'] .typing-indicator span {
  background: #60a5fa;
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

.sources-panel {
  margin-top: 6px;
  font-size: 12px;
}

.sources-panel summary {
  cursor: pointer;
  color: #6b7280;
  font-size: 11px;
}

.sources-panel ul {
  margin: 4px 0 0;
  padding-left: 1em;
  color: #6b7280;
}

.source-item {
  font-size: 11px;
  margin: 6px 0;
  padding: 4px 0;
  border-bottom: 1px solid #e5e7eb;
}

.source-item:last-child {
  border-bottom: none;
}

.source-quote {
  margin: 4px 0 0;
  padding: 4px 8px;
  border-left: 2px solid #d1d5db;
  color: #6b7280;
  font-size: 11px;
  font-style: italic;
  line-height: 1.4;
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
  gap: 6px;
  margin-top: 8px;
  justify-content: flex-start;
  width: 100%;
}

.followup-chip {
  background: #e0e7ff;
  color: #3730a3;
  border: none;
  border-radius: 16px;
  padding: 4px 12px;
  font-size: 12px;
  cursor: pointer;
  transition: background 0.2s;
  text-align: left;
}

.followup-chip:hover {
  background: #c7d2fe;
}

[data-theme='dark'] .followup-chip {
  background: #312e81;
  color: #c7d2fe;
}

[data-theme='dark'] .followup-chip:hover {
  background: #3730a3;
}

.message-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 6px;
  padding-top: 6px;
  border-top: 1px solid #e5e7eb;
  font-size: 10px;
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
  padding: 2px;
  border-radius: 4px;
  opacity: 0;
  transition:
    opacity 0.2s,
    background 0.2s;
  display: flex;
  align-items: center;
}

.message:hover .copy-btn {
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
  font-size: 11px;
  color: #9ca3af;
  padding: 0 12px;
}

.char-counter.over {
  color: #ef4444;
}

@media screen and (max-width: 480px) {
  #chat-container {
    width: 95%;
    right: 2.5%;
    bottom: 90px;
    height: 400px;
  }

  #chat-header {
    font-size: 15px;
  }

  #query-input {
    font-size: 13px;
  }
}
</style>

<style>
#chat-messages .markdown-body ol {
  list-style-type: decimal !important;
  margin: 0.5em 0;
  padding-left: 1.5em;
}

#chat-messages .markdown-body ul {
  list-style-type: disc !important;
  margin: 0.5em 0;
  padding-left: 1.5em;
}

#chat-messages .markdown-body {
  overflow-x: auto;
}

#chat-messages .markdown-body table {
  border-collapse: collapse;
  width: max-content;
  min-width: 100%;
  margin: 0.5em 0;
  font-size: 12px;
}

#chat-messages .markdown-body th,
#chat-messages .markdown-body td {
  border: 1px solid #d1d5db;
  padding: 6px 10px;
  text-align: left;
}

#chat-messages .markdown-body th {
  background: #f3f4f6;
  font-weight: 600;
}

[data-theme='dark'] #chat-messages .markdown-body th,
[data-theme='dark'] #chat-messages .markdown-body td {
  border-color: #4a4a4a;
}

[data-theme='dark'] #chat-messages .markdown-body th {
  background: #374151;
}
</style>
