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

    <div v-if="docalStore.loading" class="org-loading">Loading…</div>

    <div v-else-if="!org" class="org-not-found">
      <p class="org-not-found-title">News organization not found.</p>
      <NuxtLink to="/news" class="news-back-btn org-not-found-back">← Back to News</NuxtLink>
    </div>

    <div v-else class="org-page">
      <!-- Header -->
      <div class="org-header">
        <div class="org-header-icon">📰</div>
        <div class="org-header-info">
          <div class="org-header-top">
            <h1 class="org-name">{{ org.name }}</h1>
            <span class="org-reliability" :class="statusClass">{{ org.status }}</span>
          </div>
          <p class="org-focus">{{ org.sector }} · {{ org.ownership }}</p>
          <p class="org-desc">
            {{ org.name }} is a registered nUSA news organization under the Department of Commerce
            and Labor (DOCAL). Licensed by {{ org.issuingAuthority }}.
          </p>
          <a
            v-if="discordUrl"
            :href="discordUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="org-visit-btn"
          >
            Visit {{ org.name }} →
          </a>
        </div>
      </div>

      <!-- License Details -->
      <div class="org-section">
        <h2 class="org-section-title">License Details</h2>
        <div class="org-card">
          <p class="org-card-text">
            <strong>Owner:</strong>
            {{ org.ownerUsername || 'N/A' }}
            <br />
            <span v-if="org.representativeUsername && org.representativeUsername !== 'N/A'">
              <strong>Representative:</strong>
              {{ org.representativeUsername }}
              <br />
            </span>
            <strong>Ownership Type:</strong>
            {{ org.ownership }}
            <br />
            <strong>Issuing Authority:</strong>
            {{ org.issuingAuthority }}
            <br />
            <strong>Issued:</strong>
            {{ org.issuingDate }}
            <br />
            <strong>Expires:</strong>
            {{ org.expirationDate }}
          </p>
        </div>
      </div>

      <!-- Discord / Community -->
      <div v-if="discordUrl" class="org-section">
        <h2 class="org-section-title">Community</h2>
        <div class="org-card">
          <p class="org-card-text">Connect with {{ org.name }} directly on their Discord server.</p>
          <a
            :href="discordUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="org-visit-btn org-visit-btn-inline"
          >
            Join Discord →
          </a>
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
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useDocalStore } from '~/stores/docal-store'
import { useTheme } from '~/composables/useTheme'
import { matchesSlug } from '~/utils/slugify'

definePageMeta({ layout: false })

const route = useRoute()
const slug = computed(() => route.params.slug as string)

const { theme, toggleTheme } = useTheme()
const docalStore = useDocalStore()

const NEWS_SECTORS = ['news media', 'news and media', 'news & media', 'media', 'news']

const org = computed(() =>
  docalStore.businesses.find(
    b =>
      NEWS_SECTORS.some(s => b.sector.toLowerCase().includes(s)) && matchesSlug(b.name, slug.value)
  )
)

function extractDiscordUrl(raw: string): string {
  if (!raw) return ''
  const m = raw.match(/\[([^\]]+)\]\(([^)]+)\)/)
  if (m) return m[2].split(' ')[0]
  if (raw.startsWith('http')) return raw
  return ''
}

const discordUrl = computed(() => (org.value ? extractDiscordUrl(org.value.discord) : ''))

const statusClass = computed(() => {
  if (!org.value) return ''
  switch (org.value.status) {
    case 'Active':
      return 'high'
    case 'Pending':
    case 'Special':
      return 'moderate'
    default:
      return 'low'
  }
})

onMounted(async () => {
  await docalStore.fetchBusinesses()
})

useHead(
  computed(() => ({
    title: org.value ? `${org.value.name} - nUSA News` : 'News Organization - nUSA',
    meta: [
      {
        name: 'description',
        content: org.value
          ? `${org.value.name} is a registered nUSA news organization.`
          : 'nUSA news organization page.'
      }
    ]
  }))
)
</script>

<style scoped src="./org-page.css" />

<style scoped>
.org-loading {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  color: #9ca3af;
  padding: 5rem;
}

.org-not-found {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 5rem 1.5rem;
  text-align: center;
}

.org-not-found-title {
  font-size: 1.1rem;
  color: #6b7280;
}

.org-visit-btn-inline {
  display: inline-block;
  margin-top: 1rem;
}

.org-not-found-back {
  display: inline-block;
  margin-top: 1rem;
}
</style>
