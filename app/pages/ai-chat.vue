<template>
  <div class="ai-chat-page">
    <div class="chat-container">
      <div class="chat-header">
        <h1>🧑‍⚖️ CaseBot - AI Legal Assistant</h1>
        <p class="subtitle">Ask detailed legal questions and get comprehensive answers</p>
      </div>

      <div class="messages-area" ref="messagesContainer">
        <div 
          v-for="(message, index) in messages" 
          :key="index"
          :class="['message-wrapper', message.type]"
        >
          <div class="message-bubble">
            <div v-if="message.isMarkdown" v-html="parseMarkdown(message.text)"></div>
            <div v-else class="message-text">{{ message.text }}</div>
          </div>
        </div>

        <div v-if="isLoading" class="loading-indicator">
          <div class="spinner"></div>
          <span>CaseBot is thinking...</span>
        </div>
      </div>

      <div class="input-area">
        <textarea 
          v-model="userInput"
          placeholder="Type your legal question here... (Press Ctrl+Enter to send)"
          class="chat-textarea"
          rows="3"
          @keydown.ctrl.enter="sendMessage"
          @keydown.meta.enter="sendMessage"
        ></textarea>
        <button 
          @click="sendMessage" 
          class="send-button"
          :disabled="isLoading || !userInput.trim()"
        >
          <svg v-if="!isLoading" viewBox="0 0 24 24" width="24" height="24">
            <path fill="currentColor" d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
          </svg>
          <span v-if="isLoading">Sending...</span>
          <span v-else>Send</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'

definePageMeta({
  title: 'AI Legal Assistant',
  description: 'Chat with CaseBot AI for comprehensive legal assistance'
})

const userInput = ref('')
const messages = ref<Array<{text: string, type: 'user' | 'bot', isMarkdown?: boolean}>>([])
const isLoading = ref(false)
const messagesContainer = ref<HTMLElement | null>(null)
const threadId = ref<string | null>(null)

onMounted(() => {
  messages.value.push({
    text: 'Hello! I am CaseBot 🤖, your AI legal assistant. I can help you with legal questions, explain laws and procedures, and provide guidance on nUSA legal matters. What would you like to know?',
    type: 'bot',
    isMarkdown: false
  })
})

const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

const parseMarkdown = (text: string): string => {
  if (!text) return ''
  
  let html = text

  html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>')
  html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>')
  html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>')

  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>')

  html = html.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')

  html = html.replace(/^\* (.+)$/gm, '<li>$1</li>')
  html = html.replace(/(<li>.+<\/li>)(\n<li>)/g, '$1$2')
  html = html.replace(/(<li>.+<\/li>\n?)+/g, '<ul>$&</ul>')

  html = html.replace(/^([^<\n].+)$/gm, '<p>$1</p>')
  html = html.replace(/<p><\/p>/g, '')

  html = html.replace(/<p>(<h[1-3]>)/g, '$1')
  html = html.replace(/(<\/h[1-3]>)<\/p>/g, '$1')
  html = html.replace(/<p>(<ul>)/g, '$1')
  html = html.replace(/(<\/ul>)<\/p>/g, '$1')
  
  return html
}

const sendMessage = async () => {
  const text = userInput.value.trim()
  if (!text || isLoading.value) return

  messages.value.push({
    text: text,
    type: 'user',
    isMarkdown: false
  })
  
  userInput.value = ''
  scrollToBottom()

  isLoading.value = true
  
  try {
    const response = await $fetch<any>('/api/chatbot', {
      method: 'POST',
      body: {
        query: text,
        thread_id: threadId.value
      }
    })

    if (response?.thread_id) {
      threadId.value = response.thread_id
    }

    if (response?.response) {
      messages.value.push({
        text: response.response,
        type: 'bot',
        isMarkdown: true
      })
    }
  } catch (error: any) {
    console.error('Chatbot error:', error)
    
    let errorMessage = '⚠️ Failed to connect to CaseBot server.'
    
    if (error.statusCode === 429) {
      errorMessage = '⚠️ Too many requests. Please wait a moment before trying again.'
    } else if (error.statusCode === 400) {
      errorMessage = '⚠️ Invalid request. Please try rephrasing your question.'
    }
    
    messages.value.push({
      text: errorMessage,
      type: 'bot',
      isMarkdown: false
    })
  } finally {
    isLoading.value = false
    scrollToBottom()
  }
}
</script>

<style scoped>
.ai-chat-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

.chat-container {
  width: 100%;
  max-width: 1200px;
  height: calc(100vh - 4rem);
  background: white;
  border-radius: 1rem;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  overflow: hidden;
}

[data-theme='dark'] .chat-container {
  background: #1a1a1a;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6);
}

.chat-header {
  background: linear-gradient(135deg, #003366 0%, #0055aa 100%);
  color: white;
  padding: 2rem;
  text-align: center;
}

[data-theme='dark'] .chat-header {
  background: linear-gradient(135deg, #1e3a8a 0%, #003366 100%);
}

.chat-header h1 {
  margin: 0 0 0.5rem 0;
  font-size: 2rem;
  font-weight: 700;
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
  width: 100%;
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

.message-bubble h1,
.message-bubble h2,
.message-bubble h3 {
  margin: 1rem 0 0.5rem 0;
  font-weight: 600;
}

.message-bubble h1:first-child,
.message-bubble h2:first-child,
.message-bubble h3:first-child {
  margin-top: 0;
}

.message-bubble h1 { font-size: 1.5rem; }
.message-bubble h2 { font-size: 1.25rem; }
.message-bubble h3 { font-size: 1.1rem; }

.message-bubble p {
  margin: 0.75rem 0;
}

.message-bubble p:first-child {
  margin-top: 0;
}

.message-bubble p:last-child {
  margin-bottom: 0;
}

.message-bubble ul {
  margin: 0.75rem 0;
  padding-left: 1.5rem;
}

.message-bubble li {
  margin: 0.5rem 0;
}

.message-bubble strong {
  font-weight: 600;
}

.message-bubble em {
  font-style: italic;
}

.message-bubble a {
  color: #2563eb;
  text-decoration: underline;
}

.message-bubble a:hover {
  color: #1e40af;
}

.user .message-bubble a {
  color: #fde68a;
}

.user .message-bubble a:hover {
  color: #fef3c7;
}

[data-theme='dark'] .bot .message-bubble a {
  color: #60a5fa;
}

[data-theme='dark'] .bot .message-bubble a:hover {
  color: #93c5fd;
}

.loading-indicator {
  display: flex;
  align-items: center;
  gap: 1rem;
  color: #64748b;
  font-size: 0.875rem;
}

.spinner {
  border: 3px solid #e2e8f0;
  border-top: 3px solid #667eea;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
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

@media (max-width: 768px) {
  .ai-chat-page {
    padding: 0;
  }

  .chat-container {
    height: 100vh;
    border-radius: 0;
  }

  .chat-header h1 {
    font-size: 1.5rem;
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