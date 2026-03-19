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
          <NuxtLink to="/congress" class="loc-nav-link active">Home</NuxtLink>
          <NuxtLink to="/congress/database" class="loc-nav-link">Congress Database</NuxtLink>
          <NuxtLink to="/congress/former-members" class="loc-nav-link">Former Members</NuxtLink>
          <NuxtLink to="/congress/about" class="loc-nav-link">About</NuxtLink>
        </div>
        <NuxtLink to="/" class="loc-back-btn">← Back to nUSA</NuxtLink>
      </div>
    </nav>

    <section class="loc-hero">
      <div class="loc-hero-inner">
        <div class="loc-hero-icon">🏛️</div>
        <p class="loc-hero-eyebrow">NIGHTGALADES'S UNITED STATES OF AMERICA.</p>
        <h1 class="loc-hero-title">Library of Congress</h1>
        <p class="loc-hero-desc">
          The community ran database of current and former members of the nUSA Congress. Explore our
          nation's legislative history and representatives.
        </p>
        <div class="loc-hero-btns">
          <NuxtLink to="/congress/database" class="loc-btn-primary">🏛️ Browse Congress</NuxtLink>
          <NuxtLink to="/congress/about" class="loc-btn-secondary">📖 Learn More</NuxtLink>
        </div>
      </div>
      <div class="loc-hero-wave">
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="#f3f4f6" />
        </svg>
      </div>
    </section>

    <section class="loc-stats">
      <div class="loc-stats-inner">
        <div class="loc-stat">
          <span class="loc-stat-icon">👥</span>
          <span class="loc-stat-num">{{ activeMemberCount }}</span>
          <span class="loc-stat-label">Congress Members</span>
        </div>
        <div class="loc-stat-divider" />
        <div class="loc-stat">
          <span class="loc-stat-icon">🏛️</span>
          <span class="loc-stat-num">2</span>
          <span class="loc-stat-label">Chambers</span>
        </div>
        <div class="loc-stat-divider" />
        <div class="loc-stat">
          <span class="loc-stat-icon">📋</span>
          <span class="loc-stat-num">25+</span>
          <span class="loc-stat-label">Legislative Records</span>
        </div>
        <div class="loc-stat-divider" />
        <div class="loc-stat">
          <span class="loc-stat-icon">⭐</span>
          <span class="loc-stat-num">{{ congressStore.activeSessions }}</span>
          <span class="loc-stat-label">Active Sessions</span>
        </div>
      </div>
    </section>

    <section class="loc-members">
      <div class="loc-members-inner">
        <div class="loc-members-header">
          <div>
            <p class="loc-members-eyebrow">CURRENT SESSION</p>
            <h2 class="loc-members-title">Active Members of Congress</h2>
          </div>
          <NuxtLink to="/congress/database" class="loc-view-all">View All →</NuxtLink>
        </div>
        <div class="loc-members-grid">
          <div v-for="member in activeMembers" :key="member.username" class="loc-member-card">
            <div class="loc-member-avatar">
              <span>{{ member.initials }}</span>
            </div>
            <div class="loc-member-info">
              <p class="loc-member-name">{{ member.name }}</p>
              <p class="loc-member-role">{{ member.role }}</p>
              <div class="loc-member-tags">
                <span class="loc-tag-state">{{ member.state }}</span>
                <span
                  :class="['loc-tag-party', member.party === 'Forward' ? 'forward' : 'pioneer']"
                >
                  {{ member.party }}
                </span>
                <span class="loc-tag-chamber">{{ member.chamber }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <footer class="loc-footer">
      <div class="loc-footer-inner">
        <div class="loc-footer-col">
          <div class="loc-footer-logo">
            <span>🏛️</span>
            <div>
              <p class="loc-footer-logo-title">nUSA Library of Congress</p>
              <p class="loc-footer-logo-sub">
                nUSA — Nightgalades's United States of America. Unofficial community ran
                congressional records database.
              </p>
            </div>
          </div>
        </div>
        <div class="loc-footer-col">
          <p class="loc-footer-heading">QUICK LINKS</p>
          <NuxtLink to="/congress" class="loc-footer-link">Home</NuxtLink>
          <NuxtLink to="/congress/database" class="loc-footer-link">Congress Database</NuxtLink>
          <NuxtLink to="/congress/legislation" class="loc-footer-link">Legislation</NuxtLink>
          <NuxtLink to="/congress/about" class="loc-footer-link">About</NuxtLink>
        </div>
      </div>
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
import { computed, onMounted } from 'vue'
import { useCongressStore } from '~/stores/congress-store'
import { useTheme } from '~/composables/useTheme'

definePageMeta({
  layout: false
})

const { theme, toggleTheme } = useTheme()
const congressStore = useCongressStore()

const activeMembers = computed(() =>
  congressStore.members.filter(m => m.status === 'Active').slice(0, 4)
)

const activeMemberCount = computed(
  () => congressStore.members.filter(m => m.status === 'Active').length
)

onMounted(async () => {
  congressStore.loaded = false
  await congressStore.fetchMembers()
})

useHead({
  title: 'Library of Congress - nUSA',
  meta: [
    {
      name: 'description',
      content: 'The community ran database of current and former members of the nUSA Congress.'
    }
  ]
})
</script>

<style scoped>
.loc-wrapper {
  min-height: 100vh;
  background: #f3f4f6;
  font-family: 'Segoe UI', sans-serif;
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

.loc-hero {
  background: linear-gradient(135deg, #0d1b2a 0%, #1e3a5f 60%, #0d1b2a 100%);
  padding: 5rem 1.5rem 0;
  position: relative;
  text-align: center;
}
.loc-hero-inner {
  max-width: 700px;
  margin: 0 auto;
  padding-bottom: 4rem;
}
.loc-hero-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}
.loc-hero-eyebrow {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  color: #f59e0b;
  text-transform: uppercase;
  margin-bottom: 0.75rem;
}
.loc-hero-title {
  font-size: 3.25rem;
  font-weight: 800;
  color: #ffffff;
  line-height: 1.1;
  margin-bottom: 1.25rem;
}
.loc-hero-desc {
  font-size: 1.05rem;
  color: #cbd5e1;
  line-height: 1.7;
  margin-bottom: 2rem;
}
.loc-hero-btns {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}
.loc-btn-primary {
  padding: 0.7rem 1.75rem;
  background: #f59e0b;
  color: #1a1a1a;
  border-radius: 0.5rem;
  font-weight: 700;
  font-size: 0.95rem;
  text-decoration: none;
  transition:
    background 0.15s,
    transform 0.15s;
}
.loc-btn-primary:hover {
  background: #d97706;
  transform: translateY(-1px);
  text-decoration: none;
  color: #1a1a1a;
}
.loc-btn-secondary {
  padding: 0.7rem 1.75rem;
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 0.95rem;
  text-decoration: none;
  transition:
    background 0.15s,
    transform 0.15s;
}
.loc-btn-secondary:hover {
  background: rgba(255, 255, 255, 0.18);
  transform: translateY(-1px);
  text-decoration: none;
  color: #fff;
}
.loc-hero-wave {
  width: 100%;
  line-height: 0;
}
.loc-hero-wave svg {
  display: block;
  width: 100%;
  height: 80px;
}

.loc-stats {
  background: #ffffff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}
.loc-stats-inner {
  max-width: 900px;
  margin: 0 auto;
  padding: 2.5rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0;
  flex-wrap: wrap;
}
.loc-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.35rem;
  padding: 0 3rem;
}
.loc-stat-icon {
  font-size: 1.5rem;
  color: #6b7280;
}
.loc-stat-num {
  font-size: 2rem;
  font-weight: 800;
  color: #1e3a5f;
  line-height: 1;
}
.loc-stat-label {
  font-size: 0.78rem;
  color: #6b7280;
  text-align: center;
}
.loc-stat-divider {
  width: 1px;
  height: 3.5rem;
  background: #e5e7eb;
  flex-shrink: 0;
}

.loc-members {
  padding: 3rem 1.5rem;
  background: #f3f4f6;
}
.loc-members-inner {
  max-width: 1100px;
  margin: 0 auto;
}
.loc-members-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 1.5rem;
}
.loc-members-eyebrow {
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: #f59e0b;
  text-transform: uppercase;
  margin-bottom: 0.25rem;
}
.loc-members-title {
  font-size: 1.6rem;
  font-weight: 700;
  color: #1e3a5f;
}
.loc-view-all {
  font-size: 0.875rem;
  color: #1e3a5f;
  font-weight: 600;
  text-decoration: none;
}
.loc-view-all:hover {
  text-decoration: underline;
}
.loc-members-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
  gap: 1rem;
}
.loc-member-card {
  background: #ffffff;
  border-radius: 0.75rem;
  padding: 1.25rem;
  display: flex;
  align-items: flex-start;
  gap: 0.85rem;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.07);
  border: 1px solid #e5e7eb;
}
.loc-member-avatar {
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 50%;
  background: linear-gradient(135deg, #1e3a5f, #3b82f6);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 0.85rem;
  font-weight: 700;
  color: #ffffff;
}
.loc-member-name {
  font-size: 0.9rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.15rem;
}
.loc-member-role {
  font-size: 0.75rem;
  color: #6b7280;
  margin-bottom: 0.5rem;
}
.loc-member-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem;
}
.loc-tag-state,
.loc-tag-party,
.loc-tag-chamber {
  font-size: 0.65rem;
  font-weight: 600;
  padding: 0.15rem 0.5rem;
  border-radius: 9999px;
}
.loc-tag-state {
  background: #f3f4f6;
  color: #374151;
  border: 1px solid #d1d5db;
}
.loc-tag-chamber {
  background: #eff6ff;
  color: #1d4ed8;
  border: 1px solid #bfdbfe;
}
.loc-tag-party.forward {
  background: #eff6ff;
  color: #1d4ed8;
  border: 1px solid #bfdbfe;
}
.loc-tag-party.pioneer {
  background: #fef2f2;
  color: #b91c1c;
  border: 1px solid #fecaca;
}

.loc-footer {
  background: #0d1b2a;
  color: #9ca3af;
  padding: 3rem 1.5rem 0;
}
.loc-footer-inner {
  max-width: 1100px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2.5rem;
  padding-bottom: 2.5rem;
  border-bottom: 1px solid #1e3a5f;
}
.loc-footer-logo {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  font-size: 1.25rem;
}
.loc-footer-logo-title {
  font-size: 0.9rem;
  font-weight: 700;
  color: #f3f4f6;
  margin-bottom: 0.35rem;
}
.loc-footer-logo-sub {
  font-size: 0.78rem;
  line-height: 1.5;
  color: #6b7280;
}
.loc-footer-heading {
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: #9ca3af;
  text-transform: uppercase;
  margin-bottom: 0.75rem;
}
.loc-footer-link {
  display: block;
  font-size: 0.82rem;
  color: #6b7280;
  text-decoration: none;
  margin-bottom: 0.4rem;
  transition: color 0.15s;
}
.loc-footer-link:hover {
  color: #f3f4f6;
  text-decoration: none;
}
.loc-footer-text {
  font-size: 0.82rem;
  line-height: 1.6;
  color: #6b7280;
}
.loc-footer-bottom {
  max-width: 1100px;
  margin: 0 auto;
  padding: 1.25rem 0;
  font-size: 0.78rem;
  color: #4b5563;
  text-align: center;
}

@media (max-width: 768px) {
  .loc-nav-links {
    display: none;
  }
  .loc-hero-title {
    font-size: 2.2rem;
  }
  .loc-stats-inner {
    gap: 1rem;
  }
  .loc-stat {
    padding: 0.75rem 1.5rem;
  }
  .loc-stat-divider {
    display: none;
  }
  .loc-footer-inner {
    grid-template-columns: 1fr;
  }
  .loc-members-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
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
[data-theme='dark'] .loc-back-btn:hover {
  color: #fff;
}
[data-theme='dark'] .loc-stats {
  background: #1f2937;
}
[data-theme='dark'] .loc-stat-num {
  color: #f3f4f6;
}
[data-theme='dark'] .loc-stat-label {
  color: #9ca3af;
}
[data-theme='dark'] .loc-stat-divider {
  background: #374151;
}
[data-theme='dark'] .loc-members {
  background: #111827;
}
[data-theme='dark'] .loc-members-title {
  color: #f3f4f6;
}
[data-theme='dark'] .loc-view-all {
  color: #93c5fd;
}
[data-theme='dark'] .loc-member-card {
  background: #1f2937;
  border-color: #374151;
}
[data-theme='dark'] .loc-member-name {
  color: #f3f4f6;
}
[data-theme='dark'] .loc-member-role {
  color: #9ca3af;
}
[data-theme='dark'] .loc-tag-state {
  background: #374151;
  color: #d1d5db;
  border-color: #4b5563;
}
[data-theme='dark'] .loc-footer {
  background: #0a0f1a;
}
[data-theme='dark'] .loc-footer-bottom {
  color: #6b7280;
}
</style>
