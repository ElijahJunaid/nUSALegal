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
        <div class="org-header-icon">🏙️</div>
        <div class="org-header-info">
          <div class="org-header-top">
            <h1 class="org-name">DC Local Post</h1>
            <span class="org-reliability high">★ 4.3 · High Reliability</span>
          </div>
          <p class="org-focus">Washington D.C. · Local</p>
          <p class="org-desc">
            The primary source for local Washington D.C. news — covering city government, community
            events, and municipal affairs in the capital.
          </p>
          <a href="#" target="_blank" rel="noopener" class="org-visit-btn">Visit DC Local Post →</a>
        </div>
      </div>

      <!-- About -->
      <div class="org-section">
        <h2 class="org-section-title">About</h2>
        <div class="org-card">
          <p class="org-card-text">
            The DC Local Post is Washington D.C.'s dedicated local news outlet. It covers everything
            happening within the capital — from city council votes and mayoral actions to community
            events and neighborhood stories — keeping D.C. residents connected to their local
            government.
          </p>
        </div>
      </div>

      <!-- Reliability -->
      <div class="org-section">
        <h2 class="org-section-title">Reliability Score</h2>
        <div class="org-card reliability-card">
          <div class="reliability-score-big high">4.3 / 5</div>
          <div class="reliability-bar-wrap">
            <div class="reliability-bar">
              <div class="reliability-fill high" style="width: 86%" />
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
            <span class="org-story-tag">City</span>
            <span class="org-story-title">D.C. mayor announces infrastructure plan</span>
            <span class="org-story-arrow">→</span>
          </a>
          <a href="#" target="_blank" rel="noopener" class="org-story-item">
            <span class="org-story-tag">Local</span>
            <span class="org-story-title">Capitol Hill neighborhood report</span>
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
useHead({ title: 'DC Local Post - nUSA News' })
</script>

<style scoped src="./org-page.css" />
