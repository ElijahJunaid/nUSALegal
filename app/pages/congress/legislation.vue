<template>
  <div class="congress-page">
    <div class="container">
      <h1>Congress Legislation</h1>
      <p class="subtitle">View bills and legislation from the nUSA Congress</p>

      <div class="back-navigation">
        <NuxtLink to="/congress" class="back-link">← Back to Congress</NuxtLink>
      </div>

      <div class="legislation-container">
        <div class="tabs">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="{ active: activeTab === tab.id }"
            class="tab-button"
          >
            {{ tab.label }}
          </button>
        </div>

        <div class="tab-content">
          <div v-if="activeTab === 'bills'" class="bills-section">
            <h3>Congressional Bills</h3>
            <p>View bills introduced in the nUSA Congress.</p>
            <NuxtLink to="/legal/bills" class="action-link">View All Bills →</NuxtLink>
          </div>

          <div v-if="activeTab === 'resolutions'" class="resolutions-section">
            <h3>Resolutions</h3>
            <p>View congressional resolutions and amendments.</p>
            <div class="coming-soon">Coming soon...</div>
          </div>

          <div v-if="activeTab === 'votes'" class="votes-section">
            <h3>Vote Records</h3>
            <p>View voting records and roll calls.</p>
            <div class="coming-soon">Coming soon...</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

definePageMeta({
  title: 'Congress Legislation',
  description: 'Bills and legislation from the nUSA Congress'
})

const activeTab = ref('bills')

const tabs = [
  { id: 'bills', label: 'Bills' },
  { id: 'resolutions', label: 'Resolutions' },
  { id: 'votes', label: 'Vote Records' }
]
</script>

<style scoped>
.congress-page {
  min-height: 100vh;
  background: #f8fafc;
  color: #1e293b;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

h1 {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: #1e293b;
}

.subtitle {
  font-size: 1.125rem;
  color: #64748b;
  margin-bottom: 2rem;
}

.back-navigation {
  margin-bottom: 2rem;
}

.back-link {
  display: inline-flex;
  align-items: center;
  color: #3b82f6;
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  transition: all 0.2s;
}

.back-link:hover {
  background: #eff6ff;
  color: #2563eb;
}

.legislation-container {
  background: white;
  padding: 2rem;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  border-bottom: 1px solid #e2e8f0;
}

.tab-button {
  padding: 0.75rem 1.5rem;
  background: none;
  border: none;
  color: #64748b;
  font-weight: 500;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: all 0.2s;
}

.tab-button:hover {
  color: #1e293b;
}

.tab-button.active {
  color: #3b82f6;
  border-bottom-color: #3b82f6;
}

.tab-content {
  min-height: 200px;
}

.bills-section h3,
.resolutions-section h3,
.votes-section h3 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #1e293b;
}

.action-link {
  display: inline-flex;
  align-items: center;
  color: #3b82f6;
  text-decoration: none;
  font-weight: 500;
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  transition: all 0.2s;
}

.action-link:hover {
  background: #eff6ff;
  color: #2563eb;
}

.coming-soon {
  padding: 2rem;
  text-align: center;
  color: #64748b;
  font-style: italic;
  background: #f8fafc;
  border-radius: 0.375rem;
  margin-top: 1rem;
}

/* Dark mode */
[data-theme='dark'] .congress-page {
  background: #0f172a;
  color: #e2e8f0;
}

[data-theme='dark'] h1 {
  color: #f1f5f9;
}

[data-theme='dark'] .subtitle {
  color: #94a3b8;
}

[data-theme='dark'] .legislation-container {
  background: #1e293b;
  color: #e2e8f0;
}

[data-theme='dark'] .tabs {
  border-bottom-color: #374151;
}

[data-theme='dark'] .tab-button {
  color: #9ca3af;
}

[data-theme='dark'] .tab-button:hover {
  color: #e2e8f0;
}

[data-theme='dark'] .tab-button.active {
  color: #60a5fa;
  border-bottom-color: #60a5fa;
}

[data-theme='dark'] .bills-section h3,
[data-theme='dark'] .resolutions-section h3,
[data-theme='dark'] .votes-section h3 {
  color: #f1f5f9;
}

[data-theme='dark'] .back-link {
  color: #60a5fa;
}

[data-theme='dark'] .back-link:hover {
  background: #1e3a8a;
  color: #93c5fd;
}

[data-theme='dark'] .action-link {
  color: #60a5fa;
}

[data-theme='dark'] .action-link:hover {
  background: #1e3a8a;
  color: #93c5fd;
}

[data-theme='dark'] .coming-soon {
  background: #374151;
  color: #9ca3af;
}
</style>
