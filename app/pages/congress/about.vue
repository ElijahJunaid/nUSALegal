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
          <NuxtLink to="/congress/about" class="loc-nav-link active">About</NuxtLink>
        </div>
        <NuxtLink to="/" class="loc-back-btn">← Back to nUSA</NuxtLink>
      </div>
    </nav>

    <div class="about-page">
      <div class="about-inner">
        <div class="about-icon">🏛️</div>
        <h1 class="about-title">About the Library of Congress</h1>
        <p class="about-eyebrow">NIGHTGALADES'S UNITED STATES OF AMERICA</p>
        <div class="about-card">
          <h2 class="about-card-title">What is the nUSA Library of Congress?</h2>
          <p class="about-card-text">
            The nUSA Library of Congress is a community-maintained database tracking current and
            former members of the Nightgalades's United States of America Congress. It serves as the
            unofficial public record for the nUSA legislative branch.
          </p>
        </div>
        <div class="about-card">
          <h2 class="about-card-title">Disclaimer</h2>
          <p class="about-card-text">
            This database is maintained by community members and is not affiliated with any official
            government body. All information reflects the nUSA Roblox roleplay community.
            <strong>THIS IS NOT REAL LIFE!</strong>
          </p>
        </div>
        <NuxtLink to="/congress" class="about-back">← Back to Library of Congress</NuxtLink>
      </div>
    </div>

    <footer class="loc-footer">
      <div class="loc-footer-bottom">
        <p>&copy; 2024 nUSA Library of Congress · THIS IS NOT REAL LIFE!</p>
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
// @ts-ignore - Nuxt module alias
import { useTheme } from '~/composables/useTheme'

// @ts-ignore - Nuxt auto-import
definePageMeta({
  layout: false
})

// @ts-ignore - useHead auto-import
useHead({
  title: 'About - nUSA Library of Congress',
  meta: [{ name: 'description', content: 'About the nUSA Library of Congress community database.' }]
})

const { theme, toggleTheme } = useTheme()
</script>

<style scoped>
.loc-wrapper {
  min-height: 100vh;
  background: #f3f4f6;
  font-family: 'Segoe UI', sans-serif;
  display: flex;
  flex-direction: column;
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
  padding: 0 1.5rem;
  height: 56px;
  display: flex;
  align-items: center;
  gap: 2rem;
}

.loc-logo {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  text-decoration: none;
  flex-shrink: 0;
}

.loc-logo-icon {
  font-size: 1.4rem;
}

.loc-logo-text {
  display: flex;
  flex-direction: column;
  line-height: 1.1;
}

.loc-logo-top {
  font-size: 0.65rem;
  font-weight: 700;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.loc-logo-bottom {
  font-size: 0.85rem;
  font-weight: 700;
  color: #1e3a5f;
}

.loc-nav-links {
  display: flex;
  gap: 0.25rem;
  flex: 1;
}

.loc-nav-link {
  padding: 0.35rem 0.85rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  color: var(--color-text);
  text-decoration: none;
  transition: background 0.15s;
}
.loc-nav-link:hover {
  background: #e8f0fe;
  color: #003e73;
  text-decoration: none;
}
.loc-nav-link.active {
  color: #003e73;
  font-weight: 600;
  background: #e8f0fe;
}

.loc-back-btn {
  margin-left: auto;
  padding: 0.4rem 1rem;
  background: var(--color-primary);
  color: var(--color-text-inverse);
  border-radius: 0.375rem;
  font-size: 0.8rem;
  font-weight: 600;
  text-decoration: none;
  white-space: nowrap;
  transition: background 0.15s;
}
.loc-back-btn:hover {
  background: var(--color-primary-hover);
  text-decoration: none;
  color: var(--color-text-inverse);
}

.about-page {
  flex: 1;
  padding: 4rem 1.5rem;
}

.about-inner {
  max-width: 680px;
  margin: 0 auto;
  text-align: center;
}

.about-icon {
  font-size: 3.5rem;
  margin-bottom: 1rem;
}

.about-title {
  font-size: 2rem;
  font-weight: 800;
  color: #1e3a5f;
  margin-bottom: 0.5rem;
}

.about-eyebrow {
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  color: #f59e0b;
  text-transform: uppercase;
  margin-bottom: 2rem;
}

.about-card {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  padding: 1.5rem;
  margin-bottom: 1rem;
  text-align: left;
}

.about-card-title {
  font-size: 1rem;
  font-weight: 700;
  color: #1e3a5f;
  margin-bottom: 0.6rem;
}

.about-card-text {
  font-size: 0.9rem;
  color: #4b5563;
  line-height: 1.7;
}

.about-back {
  display: inline-block;
  margin-top: 1.5rem;
  font-size: 0.875rem;
  color: #1e3a5f;
  font-weight: 600;
  text-decoration: none;
}

.about-back:hover {
  text-decoration: underline;
}

.loc-footer {
  background: #0d1b2a;
}

.loc-footer-bottom {
  max-width: 1100px;
  margin: 0 auto;
  padding: 1.25rem 1.5rem;
  font-size: 0.78rem;
  color: #4b5563;
  text-align: center;
}

@media (max-width: 768px) {
  .loc-nav-links {
    display: none;
  }
}

.theme-toggle {
  position: fixed;
  bottom: 1rem;
  left: 1rem;
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 50%;
  border: none;
  background: #1e3a5f;
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
  background: #2d5282;
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
[data-theme='dark'] .loc-back-btn {
  background: var(--color-primary);
  color: var(--color-text-inverse);
}
[data-theme='dark'] .loc-back-btn:hover {
  background: var(--color-primary-hover);
  color: var(--color-text-inverse);
}
[data-theme='dark'] .about-page {
  background: var(--color-bg);
}
[data-theme='dark'] .about-title {
  color: var(--color-info);
}
[data-theme='dark'] .about-card {
  background: var(--color-bg-card);
  border-color: var(--color-border);
}
[data-theme='dark'] .about-card-title {
  color: var(--color-info);
}
[data-theme='dark'] .about-card-text {
  color: var(--color-text-secondary);
}
[data-theme='dark'] .about-back {
  color: var(--color-info);
}
[data-theme='dark'] .loc-footer {
  background: var(--color-bg-tertiary);
}
[data-theme='dark'] .loc-footer-bottom {
  color: var(--color-text-secondary);
}
</style>
