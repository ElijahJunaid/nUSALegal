<template>
  <div v-if="show" class="reconnection-overlay">
    <div class="reconnection-dialog">
      <div class="reconnection-icon">
        <span class="spinner">⟳</span>
      </div>
      <h3>Connection Lost</h3>
      <p>Attempting to reconnect to the lobby...</p>
      <div class="reconnection-progress">
        <div class="progress-bar">
          <div 
            class="progress-fill" 
            :style="{ width: `${(countdown / 10) * 100}%` }"
          ></div>
        </div>
        <div class="reconnection-info">
          <span>Attempt {{ attempts }}/3</span>
          <span>{{ countdown }}s remaining</span>
        </div>
      </div>
      <button class="cancel-button" @click="$emit('cancel')">
        Return to Lobby Selection
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  show: boolean
  attempts: number
  countdown: number
}>()

defineEmits<{
  cancel: []
}>()
</script>

<style scoped>
.reconnection-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  animation: fadeIn 0.3s ease;
}

.reconnection-dialog {
  background: var(--card-background);
  border: 2px solid var(--border-color);
  border-radius: 12px;
  padding: 2rem;
  max-width: 400px;
  width: 90%;
  text-align: center;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.3s ease;
}

[data-theme='dark'] .reconnection-dialog {
  border-color: var(--accent-blue);
  box-shadow: 0 10px 40px rgba(0, 212, 255, 0.2);
}

.reconnection-icon {
  margin-bottom: 1rem;
}

.spinner {
  font-size: 3rem;
  display: inline-block;
  animation: spin 1s linear infinite;
  color: var(--accent-blue);
}

.reconnection-dialog h3 {
  color: var(--text-color);
  margin: 0 0 0.5rem 0;
  font-size: 1.5rem;
}

[data-theme='dark'] .reconnection-dialog h3 {
  color: var(--accent-blue);
}

.reconnection-dialog p {
  color: var(--secondary-color);
  margin: 0 0 1.5rem 0;
}

.reconnection-progress {
  margin-bottom: 1.5rem;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 0.75rem;
}

[data-theme='dark'] .progress-bar {
  background: rgba(255, 255, 255, 0.1);
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--accent-blue) 0%, var(--link-hover) 100%);
  transition: width 1s linear;
  border-radius: 4px;
}

[data-theme='dark'] .progress-fill {
  background: linear-gradient(90deg, #00d4ff 0%, #0099cc 100%);
  box-shadow: 0 0 10px rgba(0, 212, 255, 0.5);
}

.reconnection-info {
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  color: var(--secondary-color);
}

.cancel-button {
  background-color: var(--card-background);
  color: var(--text-color);
  border: 2px solid var(--border-color);
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cancel-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px var(--shadow-color);
  border-color: var(--accent-blue);
}

[data-theme='dark'] .cancel-button {
  border-color: var(--accent-blue);
  box-shadow: 0 0 10px rgba(0, 212, 255, 0.2);
}

[data-theme='dark'] .cancel-button:hover {
  box-shadow: 0 0 20px var(--accent-blue);
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>