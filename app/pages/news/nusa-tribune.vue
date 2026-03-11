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
        <div class="org-header-icon">🗞️</div>
        <div class="org-header-info">
          <div class="org-header-top">
            <h1 class="org-name">nUSA Tribune</h1>
            <span class="org-reliability high">★ 4.5 · High Reliability</span>
          </div>
          <p class="org-focus">Federal · Politics · General</p>
          <p class="org-desc">
            The nUSA Tribune is the leading outlet for federal government coverage, reporting on
            congressional proceedings, executive orders, and national policy.
          </p>
          <a href="#" target="_blank" rel="noopener" class="org-visit-btn">Visit nUSA Tribune →</a>
        </div>
      </div>

      <!-- About -->
      <div class="org-section">
        <h2 class="org-section-title">About</h2>
        <div class="org-card">
          <p class="org-card-text">
            The nUSA Tribune was founded as a community-driven federal news outlet covering the full
            breadth of nUSA governance. From congressional floor debates to executive branch
            announcements, the Tribune aims to keep citizens informed on the workings of their
            federal government.
          </p>
        </div>
      </div>

      <!-- Reliability -->
      <div class="org-section">
        <h2 class="org-section-title">Reliability Score</h2>
        <div class="org-card reliability-card">
          <div class="reliability-score-big high">4.5 / 5</div>
          <div class="reliability-bar-wrap">
            <div class="reliability-bar">
              <div class="reliability-fill high" style="width: 90%" />
            </div>
            <span class="reliability-label high">High Reliability</span>
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
            <span class="org-story-tag">Federal</span>
            <span class="org-story-title">Congress passes new appropriations bill</span>
            <span class="org-story-arrow">→</span>
          </a>
          <a href="#" target="_blank" rel="noopener" class="org-story-item">
            <span class="org-story-tag">Executive</span>
            <span class="org-story-title">President signs executive order on trade</span>
            <span class="org-story-arrow">→</span>
          </a>
          <a href="#" target="_blank" rel="noopener" class="org-story-item">
            <span class="org-story-tag">Congress</span>
            <span class="org-story-title">Senate confirms new cabinet member</span>
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
    <ChatbotWidget />
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue'
definePageMeta({ layout: false })
onMounted(() => {
  document.documentElement.setAttribute('data-theme', 'light')
})
useHead({ title: 'nUSA Tribune - nUSA News' })
</script>

<style scoped src="./org-page.css" />
