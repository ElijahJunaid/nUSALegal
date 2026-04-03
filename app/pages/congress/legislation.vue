<template>
  <div class="loc-wrapper">
    <nav class="loc-nav">
      <div class="loc-nav-inner">
        <NuxtLink to="/congress" class="loc-logo">
          <span class="loc-logo-icon">🏛️</span>
          <div class="loc-logo-text">
            <span class="loc-logo-top">nUSA</span>
            <span class="loc-logo-bottom">Library of Congress</span>
          </div>
        </NuxtLink>
        <div class="loc-nav-links">
          <NuxtLink to="/congress" class="loc-nav-link">Home</NuxtLink>
          <NuxtLink to="/congress/database" class="loc-nav-link">Congress Database</NuxtLink>
          <NuxtLink to="/congress/former-members" class="loc-nav-link">Former Members</NuxtLink>
          <NuxtLink to="/congress/about" class="loc-nav-link">About</NuxtLink>
        </div>
        <NuxtLink to="/" class="loc-back-btn">← Back to nUSA</NuxtLink>
      </div>
    </nav>

    <section class="loc-page-content">
      <div class="loc-page-inner">
        <div class="loc-page-header">
          <h1 class="loc-page-title">Congress Legislation</h1>
          <p class="loc-page-subtitle">View bills and legislation from the nUSA Congress</p>
        </div>

        <div class="loc-page-body">
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
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// @ts-ignore - Nuxt auto-import
definePageMeta({
  layout: false,
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
.loc-wrapper {
  min-height: 100vh;
  background: var(--color-bg-page);
}

.loc-nav {
  background: var(--color-bg-card);
  border-bottom: 1px solid var(--color-border);
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 1px 3px var(--color-shadow);
}

.loc-nav-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.loc-logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
  color: inherit;
}

.loc-logo-icon {
  font-size: 1.5rem;
}

.loc-logo-text {
  display: flex;
  flex-direction: column;
}

.loc-logo-top {
  font-size: 0.875rem;
  font-weight: 700;
  color: #1e293b;
}

.loc-logo-bottom {
  font-size: 0.75rem;
  color: #64748b;
}

.loc-nav-links {
  display: flex;
  gap: 2rem;
}

.loc-nav-link {
  color: var(--color-text);
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  transition: all 0.2s ease;
  position: relative;
}

.loc-nav-link:hover {
  background: #e8f0fe;
  color: #003e73;
}

.loc-nav-link.active {
  color: #003e73;
  font-weight: 600;
  background: #e8f0fe;
}

.loc-nav-link.active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 50%;
  transform: translateX(-50%);
  width: 20px;
  height: 2px;
  background: var(--color-primary);
  border-radius: 1px;
}

.loc-back-btn {
  color: var(--color-text);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
}

.loc-back-btn:hover {
  color: var(--color-primary);
}

.loc-page-content {
  padding: 2rem;
}

.loc-page-inner {
  max-width: 1200px;
  margin: 0 auto;
}

.loc-page-header {
  margin-bottom: 2rem;
}

.loc-page-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.5rem;
}

.loc-page-subtitle {
  font-size: 1.125rem;
  color: #64748b;
}

.loc-page-body {
  background: #fff;
  border-radius: 0.5rem;
  padding: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.tabs {
  display: flex;
  border-bottom: 1px solid #e5e7eb;
  margin-bottom: 2rem;
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

[data-theme='dark'] .loc-wrapper {
  background: var(--color-bg);
}

[data-theme='dark'] .loc-nav {
  background: var(--color-bg-card);
  border-color: var(--color-border);
}

[data-theme='dark'] .loc-nav-link {
  color: var(--color-text);
}

[data-theme='dark'] .loc-nav-link:hover {
  background: #374151;
  color: #fff;
}
[data-theme='dark'] .loc-nav-link.active {
  background: #374151;
  color: #fff;
}

[data-theme='dark'] .loc-nav-link.active::after {
  background: var(--color-primary);
}

[data-theme='dark'] .loc-back-btn {
  color: var(--color-text);
}

[data-theme='dark'] .loc-back-btn:hover {
  color: var(--color-primary);
}

[data-theme='dark'] .loc-page-title {
  color: var(--color-text);
}

[data-theme='dark'] .loc-page-subtitle {
  color: var(--color-text-secondary);
}

[data-theme='dark'] .loc-page-body {
  background: var(--color-bg-card);
  color: var(--color-text);
}

[data-theme='dark'] .tabs {
  border-bottom-color: var(--color-border);
}

[data-theme='dark'] .bills-section h3,
[data-theme='dark'] .resolutions-section h3,
[data-theme='dark'] .votes-section h3 {
  color: var(--color-text);
}

[data-theme='dark'] .coming-soon {
  background: var(--color-bg-tertiary);
  color: var(--color-text-secondary);
}
</style>
