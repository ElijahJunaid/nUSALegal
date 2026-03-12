<template>
  <div class="loc-wrapper">
    <nav class="loc-nav">
      <div class="loc-nav-inner">
        <NuxtLink to="/congress" class="loc-logo">
          <span class="loc-logo-icon">🏛️</span>
          <div class="loc-logo-text">
            <span class="loc-logo-top">nUSA</span>
            <span class="loc-logo-bottom">Library of Congress</span>
          </div>
        </NuxtLink>
        <div class="loc-nav-links">
          <NuxtLink to="/congress" class="loc-nav-link">Home</NuxtLink>
          <NuxtLink to="/congress/database" class="loc-nav-link">Congress Database</NuxtLink>
          <NuxtLink to="/congress/former-members" class="loc-nav-link active">
            Former Members
          </NuxtLink>
          <NuxtLink to="/congress/about" class="loc-nav-link">About</NuxtLink>
        </div>
        <NuxtLink to="/" class="loc-back-btn">← Back to nUSA</NuxtLink>
      </div>
    </nav>

    <div class="fm-page">
      <div class="fm-header">
        <h1 class="fm-title">Former Members of Congress</h1>
        <p class="fm-subtitle">
          Historical record of former members who have served in the nUSA Congress.
        </p>
      </div>

      <div class="fm-search-bar">
        <span class="fm-search-icon">🔍</span>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search by name, state, or username..."
          class="fm-search-input"
        />
      </div>

      <div v-if="congressStore.loading" class="fm-empty">Loading…</div>

      <div v-else-if="filteredFormer.length > 0" class="fm-grid">
        <div v-for="m in filteredFormer" :key="m.username" class="fm-card">
          <div class="fm-avatar">{{ m.initials }}</div>
          <div class="fm-info">
            <p class="fm-name">{{ m.name }}</p>
            <p class="fm-role">{{ m.role }}</p>
            <p class="fm-user">@{{ m.username }}</p>
            <div class="fm-tags">
              <span v-if="m.state" class="fm-tag state">{{ m.state }}</span>
              <span :class="['fm-tag', 'party', m.party === 'Forward' ? 'forward' : 'pioneer']">
                {{ m.party }}
              </span>
              <span class="fm-tag chamber">{{ m.chamber }}</span>
              <span class="fm-tag former">Former</span>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="fm-empty">
        <p class="fm-empty-icon">🏛️</p>
        <p class="fm-empty-title">No former members found</p>
        <p class="fm-empty-sub">
          {{
            searchQuery
              ? 'No results match your search.'
              : 'Former member records have not been added yet.'
          }}
        </p>
      </div>
    </div>

    <footer class="loc-footer">
      <div class="loc-footer-bottom">
        <p>&copy; 2024 nUSA Library of Congress · THIS IS NOT REAL LIFE!</p>
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
import { useCongressStore } from '~/stores/congress-store'
import { useTheme } from '~/composables/useTheme'

const { theme, toggleTheme } = useTheme()
const congressStore = useCongressStore()
const searchQuery = ref('')

const filteredFormer = computed(() => {
  const former = [
    ...congressStore.formerMembers,
    ...congressStore.members.filter(m => m.status === 'Former')
  ]
  const q = searchQuery.value.toLowerCase()
  if (!q) return former
  return former.filter(
    m =>
      m.name.toLowerCase().includes(q) ||
      m.username.toLowerCase().includes(q) ||
      m.state.toLowerCase().includes(q)
  )
})

onMounted(async () => {
  congressStore.formerLoaded = false
  await congressStore.fetchFormerMembers()
})

useHead({
  title: 'Former Members - nUSA Library of Congress',
  meta: [
    {
      name: 'description',
      content: 'Historical record of former members of the nUSA Congress.'
    }
  ]
})
</script>

<style scoped>
.loc-wrapper {
  min-height: 100vh;
  background: #f3f4f6;
  font-family: 'Segoe UI', sans-serif;
  display: flex;
  flex-direction: column;
}

.loc-nav {
  background: #ffffff;
  border-bottom: 1px solid #e5e7eb;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

.loc-nav-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
  height: 56px;
  display: flex;
  align-items: center;
  gap: 2rem;
}

.loc-logo {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  text-decoration: none;
  flex-shrink: 0;
}

.loc-logo-icon {
  font-size: 1.4rem;
}

.loc-logo-text {
  display: flex;
  flex-direction: column;
  line-height: 1.1;
}

.loc-logo-top {
  font-size: 0.65rem;
  font-weight: 700;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.loc-logo-bottom {
  font-size: 0.85rem;
  font-weight: 700;
  color: #1e3a5f;
}

.loc-nav-links {
  display: flex;
  gap: 0.25rem;
  flex: 1;
}

.loc-nav-link {
  padding: 0.35rem 0.85rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  color: #374151;
  text-decoration: none;
  transition: background 0.15s;
}

.loc-nav-link:hover {
  background: #f3f4f6;
  color: #1e3a5f;
  text-decoration: none;
}

.loc-nav-link.active {
  color: #1e3a5f;
  font-weight: 600;
  background: #eff6ff;
}

.loc-back-btn {
  margin-left: auto;
  padding: 0.4rem 1rem;
  background: #1e3a5f;
  color: #ffffff;
  border-radius: 0.375rem;
  font-size: 0.8rem;
  font-weight: 600;
  text-decoration: none;
  white-space: nowrap;
  transition: background 0.15s;
}

.loc-back-btn:hover {
  background: #2d5282;
  text-decoration: none;
  color: #fff;
}

/* Page */
.fm-page {
  flex: 1;
  max-width: 1000px;
  margin: 0 auto;
  padding: 2.5rem 1.5rem;
  width: 100%;
}

.fm-header {
  margin-bottom: 1.75rem;
}

.fm-title {
  font-size: 1.8rem;
  font-weight: 800;
  color: #1e3a5f;
  margin-bottom: 0.35rem;
}

.fm-subtitle {
  font-size: 0.9rem;
  color: #6b7280;
}

/* Search */
.fm-search-bar {
  position: relative;
  margin-bottom: 2rem;
}

.fm-search-icon {
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.9rem;
}

.fm-search-input {
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

.fm-search-input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.15);
}

/* Grid */
.fm-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1rem;
}

.fm-card {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  padding: 1.1rem 1.25rem;
  display: flex;
  align-items: flex-start;
  gap: 0.85rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
  transition: box-shadow 0.15s;
}

.fm-card:hover {
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.fm-avatar {
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 50%;
  background: linear-gradient(135deg, #4b5563, #9ca3af);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 0.85rem;
  font-weight: 700;
  color: #ffffff;
}

.fm-info {
  flex: 1;
}

.fm-name {
  font-size: 0.9rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.15rem;
}

.fm-role {
  font-size: 0.78rem;
  color: #374151;
  margin-bottom: 0.1rem;
}

.fm-user {
  font-size: 0.72rem;
  color: #9ca3af;
  margin-bottom: 0.5rem;
}

.fm-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem;
}

.fm-tag {
  font-size: 0.65rem;
  font-weight: 600;
  padding: 0.15rem 0.5rem;
  border-radius: 9999px;
}

.fm-tag.state {
  background: #f3f4f6;
  color: #374151;
  border: 1px solid #d1d5db;
}

.fm-tag.chamber {
  background: #eff6ff;
  color: #1d4ed8;
  border: 1px solid #bfdbfe;
}

.fm-tag.party.forward {
  background: #eff6ff;
  color: #1d4ed8;
  border: 1px solid #bfdbfe;
}

.fm-tag.party.pioneer {
  background: #fef2f2;
  color: #b91c1c;
  border: 1px solid #fecaca;
}

.fm-tag.former {
  background: #f3f4f6;
  color: #6b7280;
  border: 1px solid #d1d5db;
}

/* Empty */
.fm-empty {
  text-align: center;
  padding: 5rem 1.5rem;
  color: #9ca3af;
}

.fm-empty-icon {
  font-size: 3rem;
  margin-bottom: 0.75rem;
}

.fm-empty-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: #6b7280;
  margin-bottom: 0.4rem;
}

.fm-empty-sub {
  font-size: 0.875rem;
}

/* Footer */
.loc-footer {
  background: #0d1b2a;
}

.loc-footer-bottom {
  max-width: 1100px;
  margin: 0 auto;
  padding: 1.25rem 1.5rem;
  font-size: 0.78rem;
  color: #4b5563;
  text-align: center;
}

@media (max-width: 768px) {
  .loc-nav-links {
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
  background: #1e3a5f;
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
  background: #2d5282;
}

[data-theme='dark'] .loc-wrapper {
  background: #111827;
}
[data-theme='dark'] .loc-nav {
  background: #1f2937;
  border-color: #374151;
}
[data-theme='dark'] .loc-nav-link {
  color: #d1d5db;
}
[data-theme='dark'] .loc-nav-link:hover,
[data-theme='dark'] .loc-nav-link.active {
  color: #fff;
}
[data-theme='dark'] .loc-back-btn {
  color: #9ca3af;
}
[data-theme='dark'] .fm-page {
  background: #111827;
}
[data-theme='dark'] .fm-header {
  background: #1f2937;
  border-color: #374151;
}
[data-theme='dark'] .fm-title {
  color: #f3f4f6;
}
[data-theme='dark'] .fm-subtitle {
  color: #9ca3af;
}
[data-theme='dark'] .fm-search-bar {
  background: #1f2937;
  border-color: #374151;
}
[data-theme='dark'] .fm-search-input {
  background: #1f2937;
  color: #f3f4f6;
}
[data-theme='dark'] .fm-search-input::placeholder {
  color: #6b7280;
}
[data-theme='dark'] .fm-card {
  background: #1f2937;
  border-color: #374151;
}
[data-theme='dark'] .fm-name {
  color: #f3f4f6;
}
[data-theme='dark'] .fm-role,
[data-theme='dark'] .fm-user {
  color: #9ca3af;
}
[data-theme='dark'] .fm-tag.state {
  background: #374151;
  color: #d1d5db;
  border-color: #4b5563;
}
[data-theme='dark'] .fm-tag.former {
  background: #374151;
  color: #9ca3af;
  border-color: #4b5563;
}
[data-theme='dark'] .loc-footer {
  background: #0a0f1a;
}
[data-theme='dark'] .loc-footer-bottom {
  color: #6b7280;
}
</style>
