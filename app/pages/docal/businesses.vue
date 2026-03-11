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

      <!-- Search + Filters -->
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
          <option value="Expired">Expired</option>
          <option value="Revoked">Revoked</option>
        </select>
      </div>

      <!-- Loading -->
      <div v-if="docalStore.loading" class="biz-empty">Loading…</div>

      <!-- Results -->
      <div v-else-if="filteredBusinesses.length > 0">
        <p class="biz-count">
          {{ filteredBusinesses.length }} business{{ filteredBusinesses.length !== 1 ? 'es' : '' }}
          found
        </p>
        <div class="biz-grid">
          <div v-for="b in filteredBusinesses" :key="b.name" class="biz-card">
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

      <!-- Empty -->
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

    <ChatbotWidget />
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import { useDocalStore } from '~/stores/docal-store'

definePageMeta({ layout: false })

const docalStore = useDocalStore()
const searchQuery = ref('')
const filterStatus = ref('')

const filteredBusinesses = computed(() => {
  let list = docalStore.businesses

  if (filterStatus.value) {
    list = list.filter(b => b.status === filterStatus.value)
  }
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter(
      b => b.name.toLowerCase().includes(q) || b.ownerUsername.toLowerCase().includes(q)
    )
  }
  return list
})

onMounted(async () => {
  document.documentElement.setAttribute('data-theme', 'light')
  await docalStore.fetchBusinesses()
})

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
  background: #f0fdfa;
  color: #0f4c5c;
  text-decoration: none;
}

.docal-nav-link.active {
  color: #0f4c5c;
  font-weight: 600;
  background: #f0fdfa;
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

/* Page */
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

/* Toolbar */
.biz-toolbar {
  display: flex;
  gap: 0.75rem;
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

/* Grid */
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
  background: #d1fae5;
  color: #065f46;
}

.biz-status.inactive {
  background: #f3f4f6;
  color: #6b7280;
  border: 1px solid #d1d5db;
}

.biz-status.pending {
  background: #fef3c7;
  color: #92400e;
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

/* Empty */
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

/* Footer */
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
</style>
