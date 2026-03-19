<template>
  <Teleport to="body">
    <div
      v-if="modelValue"
      class="mobile-sidebar-overlay"
      @click="$emit('update:modelValue', false)"
    ></div>
    <aside :class="['mobile-sidebar', { open: modelValue }]">
      <div class="mobile-sidebar-header">
        <h3>Chat History</h3>
        <button class="close-btn" @click="$emit('update:modelValue', false)">
          <svg viewBox="0 0 24 24" width="20" height="20">
            <path
              fill="currentColor"
              d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
            />
          </svg>
        </button>
      </div>
      <button class="mobile-new-chat-btn" @click="$emit('newChat')">
        <svg viewBox="0 0 24 24" width="16" height="16">
          <path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
        </svg>
        New Chat
      </button>
      <div class="mobile-sidebar-list">
        <ChatHistoryList @switch="id => $emit('switch', id)" />
      </div>
    </aside>
  </Teleport>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: boolean
}>()

defineEmits<{
  'update:modelValue': [value: boolean]
  newChat: []
  switch: [threadId: string]
}>()
</script>

<style scoped>
.mobile-sidebar-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 999;
}

.mobile-sidebar {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: 280px;
  background: white;
  z-index: 1000;
  transform: translateX(-100%);
  transition: transform 0.3s ease;
  display: flex;
  flex-direction: column;
  box-shadow: 4px 0 12px rgba(0, 0, 0, 0.15);
}

.mobile-sidebar.open {
  transform: translateX(0);
}

[data-theme='dark'] .mobile-sidebar {
  background: #1a1a1a;
}

.mobile-sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid #e5e7eb;
}

[data-theme='dark'] .mobile-sidebar-header {
  border-bottom-color: #374151;
}

.mobile-sidebar-header h3 {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
}

.close-btn {
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 4px;
  display: flex;
  border-radius: 4px;
  transition: all 0.2s;
}

.close-btn:hover {
  background: #e5e7eb;
  color: #374151;
}

[data-theme='dark'] .close-btn:hover {
  background: #374151;
  color: #e5e7eb;
}

.mobile-new-chat-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0.75rem;
  padding: 0.6rem 1rem;
  background: #003366;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: background 0.2s;
}

.mobile-new-chat-btn:hover {
  background: #0055aa;
}

.mobile-sidebar-list {
  flex: 1;
  overflow-y: auto;
  padding: 0 0.5rem 0.5rem;
}
</style>
