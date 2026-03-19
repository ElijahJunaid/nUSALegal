<template>
  <NuxtLayout name="default">
    <template #default>
      <div class="news-wrapper">
        <section class="news-hero">
          <div class="news-hero-inner">
            <div class="news-hero-icon">📰</div>
            <p class="news-hero-eyebrow">NIGHTGALADES'S UNITED STATES OF AMERICA</p>
            <h1 class="news-hero-title">nUSA Press &amp; Media</h1>
            <p class="news-hero-desc">
              Your directory of active news organizations covering the politics, events, and stories
              of Nightgalades's United States of America.
            </p>
          </div>
          <div class="news-hero-wave">
            <svg
              viewBox="0 0 1440 80"
              preserveAspectRatio="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="#f3f4f6" />
            </svg>
          </div>
        </section>

        <section class="news-orgs">
          <div class="news-orgs-inner">
            <div class="news-orgs-header">
              <p class="news-orgs-eyebrow">REGISTERED OUTLETS</p>
              <h2 class="news-orgs-title">News Organizations</h2>
            </div>
            <div v-if="loading" class="news-orgs-loading">Loading…</div>
            <div v-else-if="newsOrgs.length === 0" class="news-orgs-empty">
              No registered news organizations found.
            </div>
            <div v-else class="news-orgs-grid">
              <NuxtLink
                v-for="org in newsOrgs"
                :key="org.name"
                :to="org.route"
                class="news-org-card"
              >
                <div class="news-org-icon">📰</div>
                <div class="news-org-meta">
                  <p class="news-org-name">{{ org.name }}</p>
                  <p class="news-org-focus">{{ org.focus }}</p>
                </div>
              </NuxtLink>
            </div>
          </div>
        </section>

        <footer class="news-footer">
          <div class="news-footer-bottom">
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
  </NuxtLayout>
</template>

<script lang="ts" setup>
import { computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useDocalStore } from '~/stores/docal-store'
import { useTheme } from '~/composables/useTheme'
import { ChatbotWidget } from '#components'

const { theme, toggleTheme } = useTheme()
const docalStore = useDocalStore()
const { loading } = storeToRefs(docalStore)

const newsOrgs = computed(() => [
  {
    name: 'nUSA Press & Media',
    route: '/news',
    focus: 'Official government news and press releases'
  },
  {
    name: 'Nightgalades News Network',
    route: '#',
    focus: '24/7 news coverage of nUSA events'
  },
  {
    name: 'The Nightgalades Times',
    route: '#',
    focus: 'In-depth political analysis and reporting'
  },
  {
    name: 'Federal Broadcasting Service',
    route: '#',
    focus: 'Public service news and documentaries'
  }
])

onMounted(() => {
  docalStore.fetchBusinesses()
})
</script>

<style scoped>
.news-wrapper {
  min-height: 100vh;
  background: #f9fafb;
}

.news-hero {
  background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%);
  color: white;
  padding: 4rem 2rem 6rem;
  position: relative;
  overflow: hidden;
}

.news-hero-inner {
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
  position: relative;
  z-index: 2;
}

.news-hero-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.news-hero-eyebrow {
  font-size: 0.875rem;
  font-weight: 500;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  margin-bottom: 0.5rem;
  opacity: 0.9;
}

.news-hero-title {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 1rem;
  line-height: 1.2;
}

.news-hero-desc {
  font-size: 1.25rem;
  max-width: 600px;
  margin: 0 auto;
  opacity: 0.9;
  line-height: 1.6;
}

.news-hero-wave {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  overflow: hidden;
  line-height: 0;
}

.news-hero-wave svg {
  position: relative;
  display: block;
  width: calc(100% + 1.3px);
  height: 80px;
}

.news-orgs {
  background: #f3f4f6;
  padding: 4rem 2rem;
}

.news-orgs-inner {
  max-width: 1200px;
  margin: 0 auto;
}

.news-orgs-header {
  text-align: center;
  margin-bottom: 3rem;
}

.news-orgs-eyebrow {
  font-size: 0.875rem;
  font-weight: 500;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: #6b7280;
  margin-bottom: 0.5rem;
}

.news-orgs-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 1rem;
}

.news-orgs-loading,
.news-orgs-empty {
  text-align: center;
  color: #6b7280;
  font-size: 1.125rem;
  padding: 2rem;
}

.news-orgs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.news-org-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 2rem;
  text-align: center;
  transition: all 0.2s;
  text-decoration: none;
  color: inherit;
}

.news-org-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
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

.news-footer {
  background: #0a0010;
  color: white;
  padding: 2rem;
  text-align: center;
}

.news-footer-bottom {
  max-width: 1200px;
  margin: 0 auto;
  color: #6b7280;
}

[data-theme='dark'] .news-wrapper {
  background: #111827;
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
</style>
