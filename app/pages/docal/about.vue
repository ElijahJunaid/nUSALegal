<template>
  <div class="docal-wrapper">
    <nav class="docal-nav">
      <div class="docal-nav-inner">
        <NuxtLink to="/docal" class="docal-logo">
          <span class="docal-logo-icon">📋</span>
          <div class="docal-logo-text">
            <span class="docal-logo-top">nUSA</span>
            <span class="docal-logo-bottom">Dept. of Commerce &amp; Labor</span>
          </div>
        </NuxtLink>
        <div class="docal-nav-links">
          <NuxtLink to="/docal" class="docal-nav-link">Home</NuxtLink>
          <NuxtLink to="/docal/businesses" class="docal-nav-link">Business Database</NuxtLink>
          <NuxtLink to="/docal/about" class="docal-nav-link active">About</NuxtLink>
        </div>
        <NuxtLink to="/" class="docal-back-btn">← Back to nUSA</NuxtLink>
      </div>
    </nav>

    <div class="about-page">
      <div class="about-inner">
        <div class="about-icon">📋</div>
        <h1 class="about-title">About DOCAL</h1>
        <p class="about-eyebrow">NIGHTGALADES'S UNITED STATES OF AMERICA</p>
        <div class="about-card">
          <h2 class="about-card-title">What is DOCAL?</h2>
          <p class="about-card-text">
            The Department of Commerce and Labor (DOCAL) is the principal federal agency responsible
            for regulating commerce, maintaining the business registry, and protecting the rights of
            workers across Nightgalades's United States of America.
          </p>
        </div>
        <div class="about-card">
          <h2 class="about-card-title">Disclaimer</h2>
          <p class="about-card-text">
            This resource is maintained by the nUSA community and is not affiliated with any
            real-world government body. All information reflects the nUSA Roblox roleplay community.
            <strong>THIS IS NOT REAL LIFE!</strong>
          </p>
        </div>
        <NuxtLink to="/docal" class="about-back">← Back to DOCAL</NuxtLink>
      </div>
    </div>

    <footer class="docal-footer">
      <div class="docal-footer-bottom">
        <p>&copy; 2024 nUSA DOCAL · THIS IS NOT REAL LIFE!</p>
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
definePageMeta({ layout: false })

const { theme, toggleTheme } = useTheme()

// @ts-ignore - useHead auto-import
useHead({
  title: 'About - nUSA DOCAL',
  meta: [
    {
      name: 'description',
      content: 'About the nUSA Department of Commerce and Labor.'
    }
  ]
})
</script>

<style scoped>
.docal-wrapper {
  min-height: 100vh;
  background: #f3f4f6;
  font-family: 'Segoe UI', sans-serif;
  display: flex;
  flex-direction: column;
}

.docal-nav {
  background: var(--color-bg-card);
  border-bottom: 1px solid var(--color-border);
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 1px 3px var(--color-shadow);
}

.docal-nav-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
  height: 56px;
  display: flex;
  align-items: center;
  gap: 2rem;
}

.docal-logo {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  text-decoration: none;
  flex-shrink: 0;
}

.docal-logo-icon {
  font-size: 1.4rem;
}

.docal-logo-text {
  display: flex;
  flex-direction: column;
  line-height: 1.1;
}

.docal-logo-top {
  font-size: 0.65rem;
  font-weight: 700;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.docal-logo-bottom {
  font-size: 0.85rem;
  font-weight: 700;
  color: #0f4c5c;
}

.docal-nav-links {
  display: flex;
  gap: 0.25rem;
  flex: 1;
}

.docal-nav-link {
  padding: 0.35rem 0.85rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  color: var(--color-text);
  text-decoration: none;
  transition: background 0.15s;
}

.docal-nav-link:hover {
  background: #e8f0fe;
  color: #003e73;
  text-decoration: none;
}

.docal-nav-link.active {
  color: #003e73;
  font-weight: 600;
  background: #e8f0fe;
}

.docal-back-btn {
  margin-left: auto;
  padding: 0.4rem 1rem;
  background: var(--color-accent);
  color: var(--color-text-inverse);
  border-radius: 0.375rem;
  font-size: 0.8rem;
  font-weight: 600;
  text-decoration: none;
  white-space: nowrap;
  transition: background 0.15s;
}

.docal-back-btn:hover {
  background: var(--color-accent-hover);
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
  color: #0f4c5c;
  margin-bottom: 0.5rem;
}

.about-eyebrow {
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  color: #14b8a6;
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
  color: #0f4c5c;
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
  color: #0f4c5c;
  font-weight: 600;
  text-decoration: none;
}

.about-back:hover {
  text-decoration: underline;
}

.docal-footer {
  background: #0f2137;
}

.docal-footer-bottom {
  max-width: 1100px;
  margin: 0 auto;
  padding: 1.25rem 1.5rem;
  font-size: 0.78rem;
  color: #4b5563;
  text-align: center;
}

@media (max-width: 768px) {
  .docal-nav-links {
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
  background: #0f4c5c;
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
  background: #0f5f70;
}

[data-theme='dark'] .docal-wrapper {
  background: var(--color-bg);
}
[data-theme='dark'] .docal-nav {
  background: var(--color-bg-card);
  border-color: var(--color-border);
}
[data-theme='dark'] .docal-nav-link {
  color: var(--color-text);
}
[data-theme='dark'] .docal-nav-link:hover {
  background: #374151;
  color: #fff;
}
[data-theme='dark'] .docal-nav-link.active {
  background: #374151;
  color: #fff;
}
[data-theme='dark'] .docal-back-btn {
  background: var(--color-accent);
  color: var(--color-text-inverse);
}
[data-theme='dark'] .docal-back-btn:hover {
  background: var(--color-accent-hover);
  color: var(--color-text-inverse);
}
[data-theme='dark'] .about-page {
  background: var(--color-bg);
}
[data-theme='dark'] .about-title {
  color: var(--color-accent);
}
[data-theme='dark'] .about-card {
  background: var(--color-bg-card);
  border-color: var(--color-border);
}
[data-theme='dark'] .about-card-title {
  color: var(--color-accent);
}
[data-theme='dark'] .about-card-text {
  color: var(--color-text-secondary);
}
[data-theme='dark'] .about-back {
  color: var(--color-accent);
}
[data-theme='dark'] .docal-footer {
  background: var(--color-bg-tertiary);
}
[data-theme='dark'] .docal-footer-bottom {
  color: var(--color-text-secondary);
}
</style>
