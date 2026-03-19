<template>
  <div class="history-panel">
    <div class="history-header">
      <h3>Chat History</h3>
      <button class="history-new-btn" title="New chat" @click="$emit('newChat')">
        <svg viewBox="0 0 24 24" width="18" height="18">
          <path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
        </svg>
      </button>
    </div>
    <ChatHistoryList @switch="id => $emit('switch', id)" />
  </div>
</template>

<script setup lang="ts">
defineEmits<{
  newChat: []
  switch: [threadId: string]
}>()
</script>

<style scoped>
.history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.history-header h3 {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
}

.history-new-btn {
  background: none;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  padding: 4px;
  cursor: pointer;
  color: #6b7280;
  display: flex;
  transition: all 0.2s;
}

.history-new-btn:hover {
  background: #e5e7eb;
  color: #374151;
}

[data-theme='dark'] .history-new-btn {
  border-color: #4b5563;
  color: #9ca3af;
}

[data-theme='dark'] .history-new-btn:hover {
  background: #374151;
  color: #e5e7eb;
}
</style>
