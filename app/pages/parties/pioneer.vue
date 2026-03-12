<template>
  <div class="party-wrapper">
    <nav class="party-nav">
      <div class="party-nav-inner">
        <NuxtLink to="/parties" class="party-logo">
          <span class="party-logo-icon">🔴</span>
          <div class="party-logo-text">
            <span class="party-logo-top">nUSA</span>
            <span class="party-logo-bottom">Pioneer Party</span>
          </div>
        </NuxtLink>
        <NuxtLink to="/parties" class="party-back-btn pioneer">← Back to Parties</NuxtLink>
      </div>
    </nav>

    <div class="party-page">
      <div class="party-coming-soon">
        <div class="party-cs-icon">🔴</div>
        <h1 class="party-cs-title pioneer-text">Pioneer Party</h1>
        <p class="party-cs-badge pioneer-badge">Coming Soon</p>
        <p class="party-cs-sub">
          The Pioneer Party page is under construction. Check back soon for party information,
          leadership, platform, and more.
        </p>
        <NuxtLink to="/parties" class="party-cs-back">← Back to Parties</NuxtLink>
      </div>
    </div>

    <footer class="party-footer pioneer-footer">
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

useHead({ title: 'Pioneer Party - nUSA' })
</script>

<style scoped>
.party-wrapper {
  min-height: 100vh;
  background: #fef2f2;
  font-family: 'Segoe UI', sans-serif;
  display: flex;
  flex-direction: column;
}

.party-nav {
  background: #ffffff;
  border-bottom: 1px solid #fecaca;
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
  color: #b91c1c;
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

.party-back-btn.pioneer {
  background: #b91c1c;
  color: #ffffff;
}

.party-back-btn.pioneer:hover {
  background: #991b1b;
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

.pioneer-text {
  color: #b91c1c;
}

.party-cs-badge {
  display: inline-block;
  padding: 0.3rem 1rem;
  border-radius: 9999px;
  font-size: 0.8rem;
  font-weight: 700;
  margin-bottom: 1.25rem;
}

.pioneer-badge {
  background: #fee2e2;
  color: #b91c1c;
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
  background: #b91c1c;
  color: #ffffff;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 700;
  text-decoration: none;
  transition: background 0.15s;
}

.party-cs-back:hover {
  background: #991b1b;
  text-decoration: none;
  color: #fff;
}

.party-footer {
  padding: 1.25rem 1.5rem;
  text-align: center;
}

.pioneer-footer {
  background: #7f1d1d;
}

.party-footer-bottom {
  font-size: 0.78rem;
  color: #fca5a5;
}

.theme-toggle {
  position: fixed;
  bottom: 1rem;
  left: 1rem;
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 50%;
  border: none;
  background: #b91c1c;
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
  background: #dc2626;
}

[data-theme='dark'] .party-wrapper {
  background: #1a0505;
}
[data-theme='dark'] .party-nav {
  background: #2d0a0a;
  border-color: #7f1d1d;
}
[data-theme='dark'] .party-content {
  background: #1a0505;
}
[data-theme='dark'] .party-section-card {
  background: #2d0a0a;
  border-color: #7f1d1d;
}
[data-theme='dark'] .party-section-title,
[data-theme='dark'] .party-section-text {
  color: #fee2e2;
}
[data-theme='dark'] .party-footer {
  background: #100202;
}
[data-theme='dark'] .party-footer-bottom {
  color: #fca5a5;
}
</style>
