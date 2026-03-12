<template>
  <div class="un-wrapper">
    <nav class="un-nav">
      <div class="un-nav-inner">
        <NuxtLink to="/un" class="un-logo">
          <span class="un-logo-icon">🌐</span>
          <div class="un-logo-text">
            <span class="un-logo-top">nUSA</span>
            <span class="un-logo-bottom">United Nations</span>
          </div>
        </NuxtLink>
        <div class="un-nav-links">
          <NuxtLink to="/un" class="un-nav-link">Home</NuxtLink>
          <NuxtLink to="/un/nations" class="un-nav-link">Member Nations</NuxtLink>
          <NuxtLink to="/un/about" class="un-nav-link active">About</NuxtLink>
        </div>
        <NuxtLink to="/" class="un-back-btn">← Back to nUSA</NuxtLink>
      </div>
    </nav>

    <div class="about-page">
      <div class="about-inner">
        <div class="about-icon">🌐</div>
        <h1 class="about-title">About the nUSA Department of State</h1>
        <p class="about-eyebrow">NIGHTGALADES'S UNITED STATES OF AMERICA</p>
        <div class="about-card">
          <h2 class="about-card-title">What is the Department of State?</h2>
          <p class="about-card-text">
            The nUSA Department of State is the primary federal agency responsible for managing
            foreign affairs and representing nUSA on the international stage, including within the
            United Nations.
          </p>
        </div>
        <div class="about-card">
          <h2 class="about-card-title">Disclaimer</h2>
          <p class="about-card-text">
            This resource is maintained by the nUSA community and is not affiliated with any
            real-world government body or the actual United Nations.
            <strong>THIS IS NOT REAL LIFE!</strong>
          </p>
        </div>
        <NuxtLink to="/un" class="about-back">← Back to Home</NuxtLink>
      </div>
    </div>

    <footer class="un-footer">
      <div class="un-footer-bottom">
        <p>&copy; 2024 nUSA Department of State · THIS IS NOT REAL LIFE!</p>
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

const { theme, toggleTheme } = useTheme()

useHead({ title: 'About - nUSA United Nations' })
</script>

<style scoped>
.un-wrapper {
  min-height: 100vh;
  background: #f3f4f6;
  font-family: 'Segoe UI', sans-serif;
  display: flex;
  flex-direction: column;
}

.un-nav {
  background: #ffffff;
  border-bottom: 1px solid #e5e7eb;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

.un-nav-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
  height: 56px;
  display: flex;
  align-items: center;
  gap: 2rem;
}

.un-logo {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  text-decoration: none;
  flex-shrink: 0;
}

.un-logo-icon {
  font-size: 1.4rem;
}

.un-logo-text {
  display: flex;
  flex-direction: column;
  line-height: 1.1;
}

.un-logo-top {
  font-size: 0.65rem;
  font-weight: 700;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.un-logo-bottom {
  font-size: 0.85rem;
  font-weight: 700;
  color: #003e73;
}

.un-nav-links {
  display: flex;
  gap: 0.25rem;
  flex: 1;
}

.un-nav-link {
  padding: 0.35rem 0.85rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  color: #374151;
  text-decoration: none;
  transition: background 0.15s;
}

.un-nav-link:hover {
  background: #e8f0fe;
  color: #003e73;
  text-decoration: none;
}

.un-nav-link.active {
  color: #003e73;
  font-weight: 600;
  background: #e8f0fe;
}

.un-back-btn {
  margin-left: auto;
  padding: 0.4rem 1rem;
  background: #003e73;
  color: #ffffff;
  border-radius: 0.375rem;
  font-size: 0.8rem;
  font-weight: 600;
  text-decoration: none;
  white-space: nowrap;
  transition: background 0.15s;
}

.un-back-btn:hover {
  background: #005299;
  text-decoration: none;
  color: #fff;
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
  font-size: 1.8rem;
  font-weight: 800;
  color: #003e73;
  margin-bottom: 0.5rem;
}

.about-eyebrow {
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  color: #0ea5e9;
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
  color: #003e73;
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
  color: #003e73;
  font-weight: 600;
  text-decoration: none;
}

.about-back:hover {
  text-decoration: underline;
}

.un-footer {
  background: #001f3f;
}

.un-footer-bottom {
  max-width: 1100px;
  margin: 0 auto;
  padding: 1.25rem 1.5rem;
  font-size: 0.78rem;
  color: #4b5563;
  text-align: center;
}

@media (max-width: 768px) {
  .un-nav-links {
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
  background: #003e73;
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
  background: #0057a3;
}

[data-theme='dark'] .un-wrapper {
  background: #111827;
}
[data-theme='dark'] .un-nav {
  background: #1f2937;
  border-color: #374151;
}
[data-theme='dark'] .un-nav-link {
  color: #d1d5db;
}
[data-theme='dark'] .un-nav-link:hover,
[data-theme='dark'] .un-nav-link.active {
  color: #fff;
}
[data-theme='dark'] .about-page {
  background: #111827;
}
[data-theme='dark'] .about-title {
  color: #7dd3fc;
}
[data-theme='dark'] .about-card {
  background: #1f2937;
  border-color: #374151;
}
[data-theme='dark'] .about-card-title {
  color: #7dd3fc;
}
[data-theme='dark'] .about-card-text {
  color: #d1d5db;
}
[data-theme='dark'] .un-footer {
  background: #020b14;
}
[data-theme='dark'] .un-footer-bottom {
  color: #6b7280;
}
</style>
