<template>
  <div class="news-wrapper">
    <nav class="news-nav">
      <div class="news-nav-inner">
        <NuxtLink to="/news" class="news-logo">
          <span class="news-logo-icon">📰</span>
          <div class="news-logo-text">
            <span class="news-logo-top">nUSA</span>
            <span class="news-logo-bottom">Press &amp; Media</span>
          </div>
        </NuxtLink>
        <NuxtLink to="/news" class="news-back-btn">← Back to News</NuxtLink>
      </div>
    </nav>

    <div class="org-page">
      <!-- Org Header -->
      <div class="org-header">
        <div class="org-header-icon">📋</div>
        <div class="org-header-info">
          <div class="org-header-top">
            <h1 class="org-name">nUSA Daily</h1>
            <span class="org-reliability moderate">★ 3.8 · Moderate Reliability</span>
          </div>
          <p class="org-focus">Federal · Local · Mixed</p>
          <p class="org-desc">
            A broad-coverage daily publication covering both federal and local stories across all
            states and territories of nUSA.
          </p>
          <a href="#" target="_blank" rel="noopener" class="org-visit-btn">Visit nUSA Daily →</a>
        </div>
      </div>

      <!-- About -->
      <div class="org-section">
        <h2 class="org-section-title">About</h2>
        <div class="org-card">
          <p class="org-card-text">
            nUSA Daily publishes a wide range of stories spanning federal politics, state-level
            affairs, and local community coverage. As a general-interest outlet, it aims to provide
            accessible daily news for all residents of nUSA.
          </p>
        </div>
      </div>

      <!-- Reliability -->
      <div class="org-section">
        <h2 class="org-section-title">Reliability Score</h2>
        <div class="org-card reliability-card">
          <div class="reliability-score-big moderate">3.8 / 5</div>
          <div class="reliability-bar-wrap">
            <div class="reliability-bar">
              <div class="reliability-fill moderate" style="width: 76%" />
            </div>
            <span class="reliability-label moderate">Moderate Reliability</span>
          </div>
          <p class="reliability-note">
            Based on community review. Scores reflect accuracy, sourcing, and editorial standards.
          </p>
        </div>
      </div>

      <!-- Stories -->
      <div class="org-section">
        <h2 class="org-section-title">Recent Stories</h2>
        <div class="org-stories">
          <a href="#" target="_blank" rel="noopener" class="org-story-item">
            <span class="org-story-tag">Local</span>
            <span class="org-story-title">D.C. city council debates zoning law</span>
            <span class="org-story-arrow">→</span>
          </a>
          <a href="#" target="_blank" rel="noopener" class="org-story-item">
            <span class="org-story-tag">Federal</span>
            <span class="org-story-title">Federal agency releases annual report</span>
            <span class="org-story-arrow">→</span>
          </a>
          <a href="#" target="_blank" rel="noopener" class="org-story-item">
            <span class="org-story-tag">State</span>
            <span class="org-story-title">State governors meet at summit</span>
            <span class="org-story-arrow">→</span>
          </a>
          <p class="org-stories-note">Story links are placeholders — update with real URLs.</p>
        </div>
      </div>
    </div>

    <footer class="news-footer">
      <div class="news-footer-bottom">
        <p>&copy; 2024 nUSA Press &amp; Media · THIS IS NOT REAL LIFE!</p>
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
useHead({ title: 'nUSA Daily - nUSA News' })
</script>

<style scoped src="./org-page.css" />
