<template>
  <div class="party-wrapper">
    <nav class="party-nav">
      <div class="party-nav-inner">
        <NuxtLink to="/parties" class="party-logo">
          <span class="party-logo-icon">🔵</span>
          <div class="party-logo-text">
            <span class="party-logo-top">nUSA</span>
            <span class="party-logo-bottom">Forward Party</span>
          </div>
        </NuxtLink>
        <NuxtLink to="/parties" class="party-back-btn forward">← Back to Parties</NuxtLink>
      </div>
    </nav>

    <div class="party-page">
      <div class="party-coming-soon">
        <div class="party-cs-icon">🔵</div>
        <h1 class="party-cs-title forward-text">Forward Party</h1>
        <p class="party-cs-badge forward-badge">Coming Soon</p>
        <p class="party-cs-sub">
          The Forward Party page is under construction. Check back soon for party information,
          leadership, platform, and more.
        </p>
        <NuxtLink to="/parties" class="party-cs-back">← Back to Parties</NuxtLink>
      </div>
    </div>

    <footer class="party-footer forward-footer">
      <div class="party-footer-bottom">
        <p>&copy; 2024 nUSA Political Parties · THIS IS NOT REAL LIFE!</p>
      </div>
    </footer>

    <button
      @click="toggleTheme"
      class="theme-toggle"
      :title="theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'"
    >
      <span v-if="theme === 'light'">☀️</span>
      <span v-else>🌙</span>
    </button>

    <ChatbotWidget />
  </div>
</template>

<script lang="ts" setup>
import { useTheme } from '~/composables/useTheme'

definePageMeta({ layout: false })

const { theme, toggleTheme } = useTheme()

useHead({ title: 'Forward Party - nUSA' })
</script>

<style scoped>
.party-wrapper {
  min-height: 100vh;
  background: #eff6ff;
  font-family: 'Segoe UI', sans-serif;
  display: flex;
  flex-direction: column;
}

.party-nav {
  background: #ffffff;
  border-bottom: 1px solid #bfdbfe;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
}

.party-nav-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.party-logo {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  text-decoration: none;
}

.party-logo-icon {
  font-size: 1.4rem;
}

.party-logo-text {
  display: flex;
  flex-direction: column;
  line-height: 1.1;
}

.party-logo-top {
  font-size: 0.65rem;
  font-weight: 700;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.party-logo-bottom {
  font-size: 0.85rem;
  font-weight: 700;
  color: #1d4ed8;
}

.party-back-btn {
  padding: 0.4rem 1rem;
  border-radius: 0.375rem;
  font-size: 0.8rem;
  font-weight: 600;
  text-decoration: none;
  white-space: nowrap;
  transition: background 0.15s;
}

.party-back-btn.forward {
  background: #1d4ed8;
  color: #ffffff;
}

.party-back-btn.forward:hover {
  background: #1e40af;
  text-decoration: none;
  color: #fff;
}

.party-page {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4rem 1.5rem;
}

.party-coming-soon {
  text-align: center;
  max-width: 480px;
}

.party-cs-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.party-cs-title {
  font-size: 2.25rem;
  font-weight: 800;
  margin-bottom: 0.75rem;
}

.forward-text {
  color: #1d4ed8;
}

.party-cs-badge {
  display: inline-block;
  padding: 0.3rem 1rem;
  border-radius: 9999px;
  font-size: 0.8rem;
  font-weight: 700;
  margin-bottom: 1.25rem;
}

.forward-badge {
  background: #dbeafe;
  color: #1d4ed8;
}

.party-cs-sub {
  font-size: 0.9rem;
  color: #6b7280;
  line-height: 1.7;
  margin-bottom: 2rem;
}

.party-cs-back {
  display: inline-block;
  padding: 0.55rem 1.5rem;
  background: #1d4ed8;
  color: #ffffff;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 700;
  text-decoration: none;
  transition: background 0.15s;
}

.party-cs-back:hover {
  background: #1e40af;
  text-decoration: none;
  color: #fff;
}

.party-footer {
  padding: 1.25rem 1.5rem;
  text-align: center;
}

.forward-footer {
  background: #1e3a8a;
}

.party-footer-bottom {
  font-size: 0.78rem;
  color: #93c5fd;
}

.theme-toggle {
  position: fixed;
  bottom: 1rem;
  left: 1rem;
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 50%;
  border: none;
  background: #1d4ed8;
  color: #fff;
  font-size: 1.2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
  z-index: 200;
  transition: background 0.2s;
}
.theme-toggle:hover {
  background: #2563eb;
}

[data-theme='dark'] .party-wrapper {
  background: #0f172a;
}
[data-theme='dark'] .party-nav {
  background: #1e3a5f;
  border-color: #1e40af;
}
[data-theme='dark'] .party-content {
  background: #0f172a;
}
[data-theme='dark'] .party-section-card {
  background: #1e3a5f;
  border-color: #1e40af;
}
[data-theme='dark'] .party-section-title,
[data-theme='dark'] .party-section-text {
  color: #dbeafe;
}
[data-theme='dark'] .party-footer {
  background: #070f1a;
}
[data-theme='dark'] .party-footer-bottom {
  color: #93c5fd;
}
</style>
