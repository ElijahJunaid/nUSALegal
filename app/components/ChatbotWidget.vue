<template>
  <div v-if="shouldShowChatbot">
    
    <button 
      id="chat-toggle-btn" 
      @click="toggleChat"
      :title="isOpen ? 'Close chat' : 'Open chat'"
      :aria-label="isOpen ? 'Close chat' : 'Open chat'"
    >
      💬
    </button>

    <div 
      v-if="isOpen"
      id="chat-container" 
      role="region" 
      aria-label="Chatbot window"
    >
      <div id="chat-header">🧑‍⚖️ CaseBot</div>
      
      <div id="chat-messages" ref="messagesContainer" aria-live="polite">
        <div 
          v-for="(message, index) in messages" 
          :key="index"
          :class="['message', message.type]"
          role="log"
        >
          <div v-if="message.isMarkdown" v-html="parseMarkdown(message.text)"></div>
          <div v-else>{{ message.text }}</div>
        </div>

        <div v-if="isLoading" class="spinner"></div>
      </div>
      
      <div id="chat-input">
        <input 
          v-model="userInput"
          type="text" 
          id="query-input" 
          placeholder="Ask your legal question..." 
          autocomplete="off" 
          aria-label="Chat input"
          @keyup.enter="sendMessage"
        />
        <button 
          id="send-btn" 
          @click="sendMessage"
          aria-label="Send message" 
          type="button"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const isOpen = ref(false)
const userInput = ref('')
const messages = ref<Array<{text: string, type: 'user' | 'bot', isMarkdown?: boolean}>>([])
const isLoading = ref(false)
const messagesContainer = ref<HTMLElement | null>(null)
const threadId = ref<string | null>(null)

const isOnMockTrialPage = computed(() => {
  return route.path.includes('mock-trial')
})

const shouldShowChatbot = computed(() => {
  return !isOnMockTrialPage.value
})

const toggleChat = () => {
  isOpen.value = !isOpen.value

  if (isOpen.value && messages.value.length === 0) {
    messages.value.push({
      text: 'Hello! I am CaseBot 🤖. Ask me your legal questions.',
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

const sanitizeInput = (input: string): string => {
  if (!input) return ''
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
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
#chat-toggle-btn {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 56px;
  height: 56px;
  background: #003366;
  border-radius: 50%;
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
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
  width: 320px;
  height: 480px;
  background: #ffffff;
  border: 1px solid #ccc;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  font-family: Arial, sans-serif;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
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
  text-align: center;
  flex-shrink: 0;
}

[data-theme='dark'] #chat-header {
  background: linear-gradient(135deg, #1e3a8a 0%, #003366 100%);
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
  max-width: 80%;
  clear: both;
  word-wrap: break-word;
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

.message h1, .message h2, .message h3 {
  margin: 0.5em 0 0.3em 0;
  font-weight: bold;
}

.message h1 { font-size: 1.4em; }
.message h2 { font-size: 1.2em; }
.message h3 { font-size: 1.1em; }

.message p {
  margin: 0.5em 0;
}

.message ul {
  margin: 0.5em 0;
  padding-left: 1.5em;
}

.message li {
  margin: 0.3em 0;
}

.message strong {
  font-weight: bold;
}

.message em {
  font-style: italic;
}

.message a {
  color: #2563eb;
  text-decoration: underline;
}

.message a:hover {
  color: #1e40af;
}

[data-theme='dark'] .message a {
  color: #60a5fa;
}

[data-theme='dark'] .message a:hover {
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

.spinner {
  margin: 10px auto;
  border: 4px solid #ccc;
  border-top: 4px solid #003366;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
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