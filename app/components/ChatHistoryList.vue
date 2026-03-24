<template>
  <div class="history-list">
    <div
      v-for="conv in store.conversations"
      :key="conv.id"
      :class="['history-item', { active: conv.threadId === store.threadId }]"
      @click="$emit('switch', conv.threadId)"
    >
      <div class="history-item-title">{{ conv.title }}</div>
      <div class="history-item-meta">
        <span>{{ formatConvTime(conv.updatedAt) }}</span>
        <button
          class="history-delete"
          title="Delete"
          @click.stop="openDeleteModal(conv.threadId, conv.title)"
        >
          <svg viewBox="0 0 24 24" width="14" height="14">
            <path
              fill="currentColor"
              d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
            />
          </svg>
        </button>
      </div>
    </div>
    <p v-if="store.conversations.length === 0" class="history-empty">No conversation history yet</p>

    <dialog ref="deleteModal" class="modal modal-bottom sm:modal-middle">
      <div class="modal-box">
        <h3 class="text-lg font-bold">Delete conversation?</h3>
        <p class="py-4">
          Are you sure you want to delete
          <strong>"{{ deleteTitle }}"</strong>
          ? This cannot be undone.
        </p>
        <div class="modal-action">
          <form method="dialog">
            <button class="btn">Cancel</button>
          </form>
          <button class="btn btn-error" @click="doDelete">Delete</button>
        </div>
      </div>
      <form method="dialog" class="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useCasebotStore } from '~/stores/casebot-store'

defineEmits<{
  switch: [threadId: string]
}>()

const store = useCasebotStore()
const deleteModal = ref<HTMLDialogElement | null>(null)
const deleteThreadId = ref<string | null>(null)
const deleteTitle = ref('')

const openDeleteModal = (threadId: string, title: string) => {
  deleteThreadId.value = threadId
  deleteTitle.value = title.length > 40 ? title.slice(0, 40) + '...' : title
  deleteModal.value?.showModal()
}

const doDelete = () => {
  if (deleteThreadId.value) {
    store.deleteConversation(deleteThreadId.value)
  }
  deleteModal.value?.close()
  deleteThreadId.value = null
}

const formatConvTime = (ts: number): string => {
  const days = Math.floor((Date.now() - ts) / 86400000)
  if (days === 0) return 'Today'
  if (days === 1) return 'Yesterday'
  if (days < 7) return `${days}d ago`
  return new Date(ts).toLocaleDateString()
}
</script>

<style scoped>
.history-list {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.history-item {
  padding: 0.6rem 0.75rem;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s;
}

.history-item:hover {
  background: #e5e7eb;
}

.history-item.active {
  background: #dbeafe;
}

[data-theme='dark'] .history-item:hover {
  background: #1f2937;
}

[data-theme='dark'] .history-item.active {
  background: #1e3a5f;
}

.history-item-title {
  font-size: 0.85rem;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.history-item-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 4px;
  font-size: 0.7rem;
  color: #9ca3af;
}

.history-delete {
  background: none;
  border: none;
  color: #d1d5db;
  cursor: pointer;
  padding: 2px;
  border-radius: 4px;
  display: flex;
  opacity: 0;
  transition: all 0.2s;
  color: #ef4444;
  background: rgba(239, 68, 68, 0.1);
}

.history-item:hover .history-delete {
  opacity: 1;
}

.history-empty {
  text-align: center;
  color: #9ca3af;
  font-size: 0.8rem;
  padding: 1.5rem 0;
}
</style>
