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
          <NuxtLink to="/docal/businesses" class="docal-nav-link active">
            Business Database
          </NuxtLink>
          <NuxtLink to="/docal/about" class="docal-nav-link">About</NuxtLink>
        </div>
        <NuxtLink to="/" class="docal-back-btn">← Back to nUSA</NuxtLink>
      </div>
    </nav>

    <div class="biz-page">
      <div class="biz-header">
        <h1 class="biz-title">📊 Business Database</h1>
        <p class="biz-subtitle">
          Official registry of businesses registered with the nUSA Department of Commerce and Labor.
        </p>
      </div>

      <div class="biz-toolbar">
        <div class="biz-search-wrap">
          <span class="biz-search-icon">🔍</span>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search by name or owner..."
            class="biz-search-input"
          />
        </div>
        <select v-model="filterStatus" class="biz-filter">
          <option value="">All Status</option>
          <option value="Active">Active</option>
          <option value="Special">Special</option>
          <option value="Pending">Pending</option>
          <option value="Expiring Soon">Expiring Soon</option>
          <option value="Expired">Expired</option>
          <option value="Revoked">Revoked</option>
        </select>
      </div>

      <div class="biz-legend">
        <p class="legend-title">Status Legend:</p>
        <div class="legend-items">
          <div class="legend-item">
            <span class="legend-dot active"></span>
            <span>Active</span>
          </div>
          <div class="legend-item">
            <span class="legend-dot special"></span>
            <span>Special</span>
          </div>
          <div class="legend-item">
            <span class="legend-dot pending"></span>
            <span>Pending</span>
          </div>
          <div class="legend-item">
            <span class="legend-dot expiring-soon"></span>
            <span>Expiring Soon</span>
          </div>
          <div class="legend-item">
            <span class="legend-dot expired"></span>
            <span>Expired</span>
          </div>
          <div class="legend-item">
            <span class="legend-dot revoked"></span>
            <span>Revoked</span>
          </div>
        </div>
      </div>

      <div v-if="docalStore.loading" class="biz-empty">Loading…</div>

      <div v-else-if="filteredBusinesses.length > 0">
        <p class="biz-count">
          {{ filteredBusinesses.length }} business{{ filteredBusinesses.length !== 1 ? 'es' : '' }}
          found
        </p>
        <div class="biz-grid">
          <div
            v-for="b in filteredBusinesses"
            :key="b.name"
            :class="['biz-card', `biz-card-${b.status.toLowerCase()}`]"
          >
            <div class="biz-card-header">
              <div class="biz-card-icon">🏢</div>
              <div class="biz-card-titles">
                <p class="biz-name">{{ b.name }}</p>
                <p class="biz-owner">@{{ b.ownerUsername }}</p>
              </div>
              <span :class="['biz-status', b.status.toLowerCase()]">
                {{ b.status }}
              </span>
            </div>
            <div class="biz-tags">
              <span v-if="b.sector" class="biz-tag type">{{ b.sector }}</span>
              <span v-if="b.ownership" class="biz-tag ownership">{{ b.ownership }}</span>
            </div>
            <div v-if="b.issuingDate || b.expirationDate" class="biz-dates">
              <span v-if="b.issuingDate" class="biz-date">📅 Issued: {{ b.issuingDate }}</span>
              <span v-if="b.expirationDate" class="biz-date">
                ⏳ Expires: {{ b.expirationDate }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="biz-empty">
        <p class="biz-empty-icon">🏢</p>
        <p class="biz-empty-title">No businesses found</p>
        <p class="biz-empty-sub">
          {{
            searchQuery || filterStatus
              ? 'No results match your filters.'
              : 'No businesses have been registered yet.'
          }}
        </p>
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
import { ref, computed, onMounted } from 'vue'
// @ts-ignore - Nuxt module alias
import { useDocalStore } from '~/stores/docal-store'
// @ts-ignore - Nuxt module alias
import { useTheme } from '~/composables/useTheme'

// @ts-ignore - Nuxt auto-import
definePageMeta({ layout: false })

// Type definition for businesses
type Business = {
  name: string
  ownerUsername: string
  ownerDiscord: string
  representativeUsername: string
  representativeDiscord: string
  discord: string
  group: string
  sector: string
  ownership: string
  issuingAuthority: string
  issuingDate: string
  expirationDate: string
  status: 'Active' | 'Pending' | 'Revoked' | 'Special' | 'Expired'
  [key: string]: unknown
}

const { theme, toggleTheme } = useTheme()
const docalStore = useDocalStore()
const searchQuery = ref('')
const filterStatus = ref('')

const filteredBusinesses = computed(() => {
  let list = docalStore.businesses

  if (filterStatus.value) {
    list = list.filter((b: Business) => b.status === filterStatus.value)
  }
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter(
      (b: Business) => b.name.toLowerCase().includes(q) || b.ownerUsername.toLowerCase().includes(q)
    )
  }
  return list
})

onMounted(async () => {
  await docalStore.fetchBusinesses()
})

// @ts-ignore - useHead auto-import
useHead({
  title: 'Business Database - nUSA DOCAL',
  meta: [
    {
      name: 'description',
      content: 'Official registry of businesses registered with nUSA DOCAL.'
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
  background: #ffffff;
  border-bottom: 1px solid #e5e7eb;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
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
  color: #374151;
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
  background: #0f4c5c;
  color: #ffffff;
  border-radius: 0.375rem;
  font-size: 0.8rem;
  font-weight: 600;
  text-decoration: none;
  white-space: nowrap;
  transition: background 0.15s;
}

.docal-back-btn:hover {
  background: #0e6b82;
  text-decoration: none;
  color: #fff;
}

.biz-page {
  flex: 1;
  max-width: 1000px;
  margin: 0 auto;
  padding: 2.5rem 1.5rem;
  width: 100%;
}

.biz-header {
  margin-bottom: 1.75rem;
}

.biz-title {
  font-size: 1.8rem;
  font-weight: 800;
  color: #0f4c5c;
  margin-bottom: 0.35rem;
}

.biz-subtitle {
  font-size: 0.9rem;
  color: #6b7280;
}

.biz-legend {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.75rem;
  padding: 1rem;
  margin-bottom: 1.5rem;
}

.legend-title {
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: #e5e7eb;
}

.legend-items {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  color: #374151;
  font-weight: 500;
}

.legend-title {
  font-weight: 600;
  color: #111827;
  margin-bottom: 0.5rem;
}

.legend-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  flex-shrink: 0;
}

.legend-dot.active {
  background: linear-gradient(135deg, var(--color-success-bg), var(--color-success-bg-light));
  border: 1px solid var(--color-success-border);
}

.legend-dot.special {
  background: linear-gradient(135deg, var(--color-special-bg), var(--color-special-bg-light));
  border: 1px solid var(--color-special-border);
}

.legend-dot.pending {
  background: linear-gradient(135deg, var(--color-warning-bg), var(--color-warning-bg-light));
  border: 1px solid var(--color-warning-border);
}

.legend-dot.expiring-soon {
  background: linear-gradient(135deg, var(--color-expiring-bg), var(--color-expiring-bg-light));
  border: 1px solid var(--color-expiring-border);
}

.legend-dot.expired {
  background: linear-gradient(135deg, var(--color-danger-bg), var(--color-danger-bg-light));
  border: 1px solid var(--color-danger-border);
}

.legend-dot.revoked {
  background: linear-gradient(135deg, var(--color-revoked-bg), var(--color-revoked-bg-light));
  border: 1px solid var(--color-revoked-border);
}

.biz-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.biz-search-wrap {
  flex: 1;
  min-width: 220px;
  position: relative;
}

.biz-search-icon {
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.85rem;
}

.biz-search-input {
  width: 100%;
  padding: 0.6rem 0.75rem 0.6rem 2.4rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  color: #374151;
  background: #ffffff;
  outline: none;
  box-sizing: border-box;
}

.biz-search-input:focus {
  border-color: #14b8a6;
  box-shadow: 0 0 0 2px rgba(20, 184, 166, 0.15);
}

.biz-filter {
  padding: 0.6rem 0.85rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 0.82rem;
  color: #374151;
  background: #ffffff;
  cursor: pointer;
  outline: none;
}

.biz-filter:focus {
  border-color: #14b8a6;
}

.biz-count {
  font-size: 0.82rem;
  color: #6b7280;
  margin-bottom: 1rem;
}

.biz-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
}

.biz-card {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  padding: 1.25rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
  transition: box-shadow 0.15s;
}

.biz-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* Color-coded business cards */
.biz-card-active {
  border-left: 4px solid #10b981;
  background: linear-gradient(135deg, #f0fdf4 0%, #dcfce2 100%);
}

.biz-card-active:hover {
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2);
}

.biz-card-special {
  border-left: 4px solid #8b5cf6;
  background: linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%);
}

.biz-card-special:hover {
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.2);
}

.biz-card-pending {
  border-left: 4px solid #f59e0b;
  background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
}

.biz-card-pending:hover {
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.2);
}

.biz-card-expired {
  border-left: 4px solid #991b1b;
  background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
}

.biz-card-expired:hover {
  box-shadow: 0 4px 12px rgba(153, 27, 27, 0.2);
}

.biz-card-revoked {
  border-left: 4px solid #000000;
  background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
}

.biz-card-revoked:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

/* Dark mode variants */
[data-theme='dark'] .biz-card-active {
  background: linear-gradient(135deg, #047857 0%, #065f46 100%);
  border-left-color: #10b981;
  box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
}

[data-theme='dark'] .biz-card-special {
  background: linear-gradient(135deg, #6d28d9 0%, #5b21b6 100%);
  border-left-color: #8b5cf6;
  box-shadow: 0 6px 20px rgba(139, 92, 246, 0.4);
}

[data-theme='dark'] .biz-card-pending {
  background: linear-gradient(135deg, #d97706 0%, #92400e 100%);
  border-left-color: #f59e0b;
  box-shadow: 0 6px 20px rgba(245, 158, 11, 0.4);
}

[data-theme='dark'] .biz-card-expired {
  background: linear-gradient(135deg, #b91c1c 0%, #991b1b 100%);
  border-left-color: #ef4444;
  box-shadow: 0 6px 20px rgba(239, 68, 68, 0.4);
}

[data-theme='dark'] .biz-card-revoked {
  background: linear-gradient(135deg, #4b5563 0%, #374151 100%);
  border-left-color: #ef4444;
  box-shadow: 0 6px 20px rgba(239, 68, 68, 0.4);
}

.biz-card-header {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}

.biz-card-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
  margin-top: 0.1rem;
}

.biz-card-titles {
  flex: 1;
}

.biz-name {
  font-size: 0.95rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.15rem;
}

.biz-owner {
  font-size: 0.78rem;
  color: #6b7280;
}

.biz-status {
  font-size: 0.65rem;
  font-weight: 700;
  padding: 0.2rem 0.6rem;
  border-radius: 9999px;
  flex-shrink: 0;
}

.biz-status.active {
  background: linear-gradient(135deg, var(--color-success-bg), var(--color-success-bg-light));
  color: var(--color-success-text);
  border: 1px solid var(--color-success-border);
  font-weight: 600;
}

.biz-status.special {
  background: linear-gradient(135deg, var(--color-special-bg), var(--color-special-bg-light));
  color: var(--color-special-text);
  border: 1px solid var(--color-special-border);
  font-weight: 600;
}

.biz-status.pending {
  background: linear-gradient(135deg, var(--color-warning-bg), var(--color-warning-bg-light));
  color: var(--color-warning-text);
  border: 1px solid var(--color-warning-border);
  font-weight: 600;
}

.biz-status.expired {
  background: linear-gradient(135deg, var(--color-danger-bg), var(--color-danger-bg-light));
  color: var(--color-danger-text);
  border: 1px solid var(--color-danger-border);
  font-weight: 600;
}

.biz-status.revoked {
  background: linear-gradient(135deg, var(--color-revoked-bg), var(--color-revoked-bg-light));
  color: var(--color-revoked-text);
  border: 1px solid var(--color-revoked-border);
  font-weight: 600;
}

.biz-status.expiring-soon {
  background: linear-gradient(135deg, var(--color-expiring-bg), var(--color-expiring-bg-light));
  color: var(--color-expiring-text);
  border: 1px solid var(--color-expiring-border);
  font-weight: 600;
  animation: pulse-warning 2s infinite;
}

@keyframes pulse-warning {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}

.biz-desc {
  font-size: 0.8rem;
  color: #4b5563;
  line-height: 1.6;
  margin-bottom: 0.75rem;
}

.biz-tags {
  display: flex;
  gap: 0.35rem;
  flex-wrap: wrap;
}

.biz-tag {
  font-size: 0.65rem;
  font-weight: 600;
  padding: 0.15rem 0.5rem;
  border-radius: 9999px;
}

.biz-tag.type {
  background: #f0fdfa;
  color: #0f4c5c;
  border: 1px solid #99f6e4;
}

.biz-tag.ownership {
  background: #f3f4f6;
  color: #374151;
  border: 1px solid #d1d5db;
}

.biz-dates {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  margin-top: 0.5rem;
}

.biz-date {
  font-size: 0.72rem;
  color: #6b7280;
}

.biz-empty {
  text-align: center;
  padding: 5rem 1.5rem;
  color: #9ca3af;
}

.biz-empty-icon {
  font-size: 3rem;
  margin-bottom: 0.75rem;
}

.biz-empty-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: #6b7280;
  margin-bottom: 0.4rem;
}

.biz-empty-sub {
  font-size: 0.875rem;
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

  .biz-toolbar {
    flex-direction: column;
  }

  .biz-search-wrap {
    min-width: unset;
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
  background: #111827;
}
[data-theme='dark'] .docal-nav {
  background: #1f2937;
  border-color: #374151;
}
[data-theme='dark'] .docal-nav-link {
  color: #d1d5db;
}
[data-theme='dark'] .docal-nav-link:hover {
  background: #374151;
  color: #fff;
}
[data-theme='dark'] .docal-nav-link.active {
  background: #374151;
  color: #fff;
}
[data-theme='dark'] .biz-page {
  background: #111827;
}
[data-theme='dark'] .biz-title {
  color: #5eead4;
}
[data-theme='dark'] .biz-subtitle {
  color: #9ca3af;
}
[data-theme='dark'] .biz-search-input {
  background: #1f2937;
  color: #f3f4f6;
  border-color: #374151;
}
[data-theme='dark'] .biz-filter {
  background: #1f2937;
  color: #f3f4f6;
  border-color: #374151;
}
[data-theme='dark'] .biz-card {
  background: #1f2937;
  border-color: #374151;
}
[data-theme='dark'] .biz-name {
  color: #f3f4f6;
}
[data-theme='dark'] .biz-owner {
  color: #9ca3af;
}
[data-theme='dark'] .biz-desc {
  color: #d1d5db;
}
[data-theme='dark'] .biz-tag {
  background: #374151;
  color: #d1d5db;
  border-color: #4b5563;
}
[data-theme='dark'] .docal-footer {
  background: #0a1520;
}
[data-theme='dark'] .docal-footer-bottom {
  color: #6b7280;
}

/* Dark mode legend */
[data-theme='dark'] .legend-title {
  color: #f9fafb;
}
[data-theme='dark'] .legend-item {
  color: #e5e7eb;
  font-weight: 500;
}

/* Dark mode card text improvements */
[data-theme='dark'] .biz-card-header {
  color: #f9fafb;
}
[data-theme='dark'] .biz-name {
  color: #f9fafb;
}
[data-theme='dark'] .biz-owner {
  color: #d1d5db;
}
[data-theme='dark'] .biz-desc {
  color: #e5e7eb;
}
[data-theme='dark'] .biz-tag {
  background: #374151;
  color: #e5e7eb;
  border-color: #4b5563;
}
</style>
