<template>
  <div class="news-wrapper">
    <!-- Navbar -->
    <nav class="news-nav">
      <div class="news-nav-inner">
        <NuxtLink to="/news" class="news-logo">
          <span class="news-logo-icon">📰</span>
          <div class="news-logo-text">
            <span class="news-logo-top">nUSA</span>
            <span class="news-logo-bottom">Press &amp; Media</span>
          </div>
        </NuxtLink>
        <NuxtLink to="/" class="news-back-btn">← Back to nUSA</NuxtLink>
      </div>
    </nav>

    <!-- Hero -->
    <section class="news-hero">
      <div class="news-hero-inner">
        <div class="news-hero-icon">📰</div>
        <p class="news-hero-eyebrow">NIGHTGALADES'S UNITED STATES OF AMERICA</p>
        <h1 class="news-hero-title">nUSA Press &amp; Media</h1>
        <p class="news-hero-desc">
          Your directory of active news organizations covering the politics, events, and stories of
          Nightgalades's United States of America.
        </p>
      </div>
      <div class="news-hero-wave">
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="#f3f4f6" />
        </svg>
      </div>
    </section>

    <!-- Orgs -->
    <section class="news-orgs">
      <div class="news-orgs-inner">
        <div class="news-orgs-header">
          <p class="news-orgs-eyebrow">REGISTERED OUTLETS</p>
          <h2 class="news-orgs-title">News Organizations</h2>
        </div>
        <div v-if="docalStore.loading" class="news-orgs-loading">Loading…</div>
        <div v-else-if="newsOrgs.length === 0" class="news-orgs-empty">
          No registered news organizations found.
        </div>
        <div v-else class="news-orgs-grid">
          <NuxtLink v-for="org in newsOrgs" :key="org.name" :to="org.route" class="news-org-card">
            <div class="news-org-icon">📰</div>
            <div class="news-org-meta">
              <p class="news-org-name">{{ org.name }}</p>
              <p class="news-org-focus">{{ org.focus }}</p>
            </div>
            <span class="news-org-cta">View →</span>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Footer -->
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
import { computed, onMounted } from 'vue'
import { useDocalStore } from '~/stores/docal-store'
import { useTheme } from '~/composables/useTheme'
import { slugify } from '~/utils/slugify'

const { theme, toggleTheme } = useTheme()
const docalStore = useDocalStore()

const NEWS_SECTORS = ['news media', 'news and media', 'news & media', 'media', 'news']

const newsOrgs = computed(() =>
  docalStore.businesses
    .filter(
      b => NEWS_SECTORS.some(s => b.sector.toLowerCase().includes(s)) && b.status === 'Active'
    )
    .map(b => ({
      name: b.name,
      focus: b.sector,
      route: `/news/${slugify(b.name)}`
    }))
)

onMounted(async () => {
  docalStore.loaded = false
  await docalStore.fetchBusinesses()
})

useHead({
  title: 'Press & Media - nUSA',
  meta: [
    {
      name: 'description',
      content: 'Directory of news organizations covering nUSA politics, events, and stories.'
    }
  ]
})
</script>

<style scoped>
.news-wrapper {
  min-height: 100vh;
  background: #f3f4f6;
  font-family: 'Segoe UI', sans-serif;
}

/* Navbar */
.news-nav {
  background: #ffffff;
  border-bottom: 1px solid #e5e7eb;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

.news-nav-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.news-logo {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  text-decoration: none;
}

.news-logo-icon {
  font-size: 1.4rem;
}

.news-logo-text {
  display: flex;
  flex-direction: column;
  line-height: 1.1;
}

.news-logo-top {
  font-size: 0.65rem;
  font-weight: 700;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.news-logo-bottom {
  font-size: 0.85rem;
  font-weight: 700;
  color: #7f1d1d;
}

.news-back-btn {
  padding: 0.4rem 1rem;
  background: #7f1d1d;
  color: #ffffff;
  border-radius: 0.375rem;
  font-size: 0.8rem;
  font-weight: 600;
  text-decoration: none;
  white-space: nowrap;
  transition: background 0.15s;
}

.news-back-btn:hover {
  background: #991b1b;
  text-decoration: none;
  color: #fff;
}

/* Hero */
.news-hero {
  background: linear-gradient(135deg, #1a0a0a 0%, #7f1d1d 60%, #1a0a0a 100%);
  padding: 5rem 1.5rem 0;
  position: relative;
  text-align: center;
}

.news-hero-inner {
  max-width: 680px;
  margin: 0 auto;
  padding-bottom: 4rem;
}

.news-hero-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.news-hero-eyebrow {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  color: #fca5a5;
  text-transform: uppercase;
  margin-bottom: 0.75rem;
}

.news-hero-title {
  font-size: 3rem;
  font-weight: 800;
  color: #ffffff;
  line-height: 1.1;
  margin-bottom: 1.25rem;
}

.news-hero-desc {
  font-size: 1rem;
  color: #fecaca;
  line-height: 1.75;
}

.news-hero-wave {
  width: 100%;
  line-height: 0;
}

.news-hero-wave svg {
  display: block;
  width: 100%;
  height: 80px;
}

/* Orgs */
.news-orgs {
  padding: 3rem 1.5rem 4rem;
  background: #f3f4f6;
}

.news-orgs-inner {
  max-width: 1100px;
  margin: 0 auto;
}

.news-orgs-header {
  margin-bottom: 1.75rem;
}

.news-orgs-eyebrow {
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: #dc2626;
  text-transform: uppercase;
  margin-bottom: 0.25rem;
}

.news-orgs-title {
  font-size: 1.6rem;
  font-weight: 700;
  color: #1f2937;
}

.news-orgs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.25rem;
}

/* Org Card */
.news-org-card {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  transition: box-shadow 0.15s;
}

.news-org-card:hover {
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.1);
}

.news-org-top {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
}

.news-org-icon {
  font-size: 1.75rem;
  flex-shrink: 0;
  margin-top: 0.1rem;
}

.news-org-meta {
  flex: 1;
}

.news-org-name {
  font-size: 1rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.15rem;
}

.news-org-focus {
  font-size: 0.72rem;
  color: #9ca3af;
  font-weight: 500;
}

/* Reliability */
.news-reliability {
  font-size: 0.7rem;
  font-weight: 700;
  padding: 0.25rem 0.65rem;
  border-radius: 9999px;
  flex-shrink: 0;
  white-space: nowrap;
}

.news-reliability.high {
  background: #d1fae5;
  color: #065f46;
}

.news-reliability.moderate {
  background: #fef3c7;
  color: #92400e;
}

.news-reliability.low {
  background: #fee2e2;
  color: #991b1b;
}

.news-org-desc {
  font-size: 0.85rem;
  color: #4b5563;
  line-height: 1.65;
}

/* Stories */
.news-stories {
  background: #f9fafb;
  border-radius: 0.5rem;
  padding: 0.85rem 1rem;
  border: 1px solid #f3f4f6;
}

.news-stories-label {
  font-size: 0.68rem;
  font-weight: 700;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: 0.5rem;
}

.news-stories-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.news-story-link {
  font-size: 0.8rem;
  color: #dc2626;
  text-decoration: none;
  font-weight: 500;
}

.news-story-link:hover {
  text-decoration: underline;
}

.news-story-empty {
  font-size: 0.8rem;
  color: #9ca3af;
  font-style: italic;
}

.news-org-cta {
  display: block;
  text-align: center;
  padding: 0.55rem 1rem;
  background: #7f1d1d;
  color: #ffffff;
  border-radius: 0.5rem;
  font-size: 0.82rem;
  font-weight: 700;
  margin-top: auto;
}

.news-org-card:hover .news-org-cta {
  background: #991b1b;
}

/* Footer */
.news-footer {
  background: #1a0a0a;
}

.news-footer-bottom {
  max-width: 1100px;
  margin: 0 auto;
  padding: 1.25rem 1.5rem;
  font-size: 0.78rem;
  color: #4b5563;
  text-align: center;
}

@media (max-width: 768px) {
  .news-hero-title {
    font-size: 2.1rem;
  }

  .news-orgs-grid {
    grid-template-columns: 1fr;
  }
}

.news-orgs-loading,
.news-orgs-empty {
  padding: 3rem;
  text-align: center;
  color: #9ca3af;
  font-size: 0.9rem;
}

.news-org-card.no-link {
  cursor: default;
  text-decoration: none;
  color: inherit;
}

.news-org-card.no-link:hover {
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
}

.theme-toggle {
  position: fixed;
  bottom: 1rem;
  left: 1rem;
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 50%;
  border: none;
  background: #7f1d1d;
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
  background: #991b1b;
}

[data-theme='dark'] .news-wrapper {
  background: #111827;
}
[data-theme='dark'] .news-nav {
  background: #1f2937;
  border-color: #374151;
}
[data-theme='dark'] .news-logo-top {
  color: #9ca3af;
}
[data-theme='dark'] .news-logo-bottom {
  color: #fca5a5;
}
[data-theme='dark'] .news-orgs {
  background: #111827;
}
[data-theme='dark'] .news-orgs-title {
  color: #f3f4f6;
}
[data-theme='dark'] .news-org-card {
  background: #1f2937;
  border-color: #374151;
}
[data-theme='dark'] .news-org-name {
  color: #f3f4f6;
}
[data-theme='dark'] .news-org-focus {
  color: #9ca3af;
}
[data-theme='dark'] .news-footer {
  background: #0a0010;
}
[data-theme='dark'] .news-footer-bottom {
  color: #6b7280;
}
</style>
