<template>
  <div class="pw-root">
    <nav class="pw-nav">
      <div class="pw-nav-inner">
        <NuxtLink to="/parties" class="pw-logo">
          <span class="pw-logo-icon">🔵</span>
          <div class="pw-logo-text">
            <span class="pw-logo-top">nUSA</span>
            <span class="pw-logo-bottom">Forward Party</span>
          </div>
        </NuxtLink>
        <NuxtLink to="/parties" class="pw-back-btn">← Back to Parties</NuxtLink>
      </div>
    </nav>

    <div class="pw-masthead">
      <div class="pw-masthead-inner">
        <div class="pw-masthead-icon">🔵</div>
        <h1 class="pw-masthead-title">Forward Party</h1>
        <p class="pw-masthead-tagline">Progress, unity, and a forward-looking nUSA.</p>
      </div>
    </div>

    <div class="pw-content">
      <div class="pw-info-row">
        <div class="pw-card">
          <h2 class="pw-card-label">Quick Facts</h2>
          <div class="pw-fact">
            <span class="pw-fact-key">Senate Seats</span>
            <span class="pw-fact-val">{{ senateCount }}</span>
          </div>
          <div class="pw-fact">
            <span class="pw-fact-key">House Seats</span>
            <span class="pw-fact-val">{{ houseCount }}</span>
          </div>
          <div class="pw-fact pw-fact-total">
            <span class="pw-fact-key pw-fact-key-total">Total Members</span>
            <span class="pw-fact-val pw-fact-val-total">{{ partyMembers.length }}</span>
          </div>
        </div>

        <div class="pw-card pw-about-card">
          <h2 class="pw-card-label">About the Forward Party</h2>
          <p class="pw-about-text">
            The Forward Party champions progress, unity, and a modern vision for nUSA. Committed to
            building inclusive institutions and forward-thinking policy, Forward members serve
            across both chambers of Congress working toward a stronger, more connected nation.
          </p>
          <p class="pw-about-text">
            Founded on the principles of civic engagement and collaborative governance, the Forward
            Party represents those who believe that nUSA's best days are ahead.
          </p>
          <div class="pw-meta-row">
            <div class="pw-meta-item">
              <span class="pw-meta-key">Founded</span>
              <span class="pw-meta-val">2024</span>
            </div>
            <div class="pw-meta-item">
              <span class="pw-meta-key">Ideology</span>
              <span class="pw-meta-val">Liberal</span>
            </div>
            <div class="pw-meta-item">
              <span class="pw-meta-key">Status</span>
              <span class="pw-meta-val pw-meta-active">Active</span>
            </div>
          </div>
          <a href="#" class="pw-join-btn">Join the Forward Party →</a>
        </div>
      </div>

      <div class="pw-card">
        <h2 class="pw-roster-title">Current Members of Congress</h2>
        <div v-if="congressStore.loading" class="pw-empty">Loading members…</div>
        <div v-else-if="partyMembers.length === 0" class="pw-empty">
          No current members of Congress affiliated with the Forward Party.
        </div>
        <div v-else class="pw-table-wrap">
          <table class="pw-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Role</th>
                <th>State</th>
                <th>Chamber</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="m in partyMembers" :key="m.username">
                <td class="pw-td-name">{{ m.name }}</td>
                <td>{{ m.role }}</td>
                <td>{{ m.state }}</td>
                <td>
                  <span class="pw-badge" :class="m.chamber.toLowerCase()">{{ m.chamber }}</span>
                </td>
                <td>
                  <span class="pw-status" :class="m.status.toLowerCase()">{{ m.status }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <footer class="pw-footer">
      <p class="pw-footer-text">&copy; 2024 nUSA Political Parties · THIS IS NOT REAL LIFE!</p>
    </footer>

    <button
      @click="toggleTheme"
      class="pw-theme-btn"
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

const partyMembers = computed(() => congressStore.members.filter(m => m.party === 'Forward'))
const senateCount = computed(() => partyMembers.value.filter(m => m.chamber === 'Senate').length)
const houseCount = computed(() => partyMembers.value.filter(m => m.chamber === 'House').length)

onMounted(async () => {
  congressStore.loaded = false
  await congressStore.fetchMembers()
})

useHead({ title: 'Forward Party - nUSA' })
</script>

<style scoped>
.pw-root {
  min-height: 100vh;
  background: #f0f6ff;
  font-family: 'Segoe UI', Tahoma, sans-serif;
  display: flex;
  flex-direction: column;
  color: #1f2937;
}

.pw-nav {
  background: #ffffff;
  border-bottom: 2px solid #bfdbfe;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.07);
}
.pw-nav-inner {
  max-width: 960px;
  margin: 0 auto;
  padding: 0 1.5rem;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.pw-logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none !important;
  color: #1f2937 !important;
}
.pw-logo-icon {
  font-size: 1.4rem;
}
.pw-logo-text {
  display: flex;
  flex-direction: column;
  line-height: 1.15;
}
.pw-logo-top {
  font-size: 0.62rem;
  font-weight: 700;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}
.pw-logo-bottom {
  font-size: 0.82rem;
  font-weight: 700;
  color: #1d4ed8;
}
.pw-back-btn {
  padding: 0.4rem 1rem;
  border-radius: 0.375rem;
  font-size: 0.8rem;
  font-weight: 600;
  text-decoration: none !important;
  background: #1d4ed8;
  color: #ffffff !important;
  transition: background 0.15s;
  white-space: nowrap;
}
.pw-back-btn:hover {
  background: #1e40af;
}

.pw-masthead {
  background: linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 100%);
  padding: 3.5rem 1.5rem 3rem;
  text-align: center;
}
.pw-masthead-inner {
  max-width: 600px;
  margin: 0 auto;
}
.pw-masthead-icon {
  font-size: 3rem;
  margin-bottom: 0.75rem;
}
.pw-masthead-title {
  font-size: 2.75rem;
  font-weight: 800;
  color: #ffffff !important;
  line-height: 1.1;
  margin-bottom: 0.5rem;
}
.pw-masthead-tagline {
  font-size: 1rem;
  color: #bfdbfe;
}

.pw-content {
  flex: 1;
  max-width: 960px;
  margin: 0 auto;
  width: 100%;
  padding: 2.5rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
}

.pw-info-row {
  display: grid;
  grid-template-columns: 260px 1fr;
  gap: 1.5rem;
  align-items: start;
}

.pw-card {
  background: #ffffff;
  border: 1.5px solid #bfdbfe;
  border-radius: 0.875rem;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(29, 78, 216, 0.07);
}
.pw-about-card {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
.pw-card-label {
  font-size: 0.72rem;
  font-weight: 700;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 0.75rem;
}

.pw-fact {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid #eff6ff;
}
.pw-fact:last-of-type {
  border-bottom: none;
}
.pw-fact-key {
  font-size: 0.84rem;
  color: #6b7280;
}
.pw-fact-val {
  font-size: 0.875rem;
  font-weight: 700;
  color: #1e3a8a;
}
.pw-fact-key-total {
  color: #1d4ed8;
  font-weight: 600;
}
.pw-fact-val-total {
  font-size: 0.875rem;
  color: #1d4ed8;
  background: #dbeafe;
  padding: 0.15rem 0.65rem;
  border-radius: 9999px;
}

.pw-about-text {
  font-size: 0.875rem;
  color: #374151;
  line-height: 1.75;
  margin: 0;
}
.pw-meta-row {
  display: flex;
  gap: 1.5rem;
  padding-top: 0.75rem;
  border-top: 1px solid #eff6ff;
  flex-wrap: wrap;
}
.pw-meta-item {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}
.pw-meta-key {
  font-size: 0.68rem;
  font-weight: 700;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.07em;
}
.pw-meta-val {
  font-size: 0.875rem;
  font-weight: 700;
  color: #1e3a8a;
}
.pw-meta-active {
  color: #065f46;
}
.pw-join-btn {
  align-self: flex-start;
  margin-top: 0.25rem;
  padding: 0.5rem 1.2rem;
  background: #1d4ed8;
  color: #ffffff !important;
  border-radius: 0.5rem;
  font-size: 0.84rem;
  font-weight: 700;
  text-decoration: none !important;
  transition: background 0.15s;
  display: inline-block;
}
.pw-join-btn:hover {
  background: #1e40af;
}

.pw-roster-title {
  font-size: 1rem;
  font-weight: 700;
  color: #1e3a8a !important;
  margin-bottom: 1rem;
  padding-bottom: 0.6rem;
  border-bottom: 2px solid #bfdbfe;
}
.pw-empty {
  font-size: 0.875rem;
  color: #9ca3af;
  padding: 1rem 0;
}
.pw-table-wrap {
  overflow-x: auto;
}
.pw-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
}
.pw-table th {
  text-align: left;
  padding: 0.55rem 0.75rem;
  font-size: 0.72rem;
  font-weight: 700;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 1.5px solid #e5e7eb;
}
.pw-table td {
  padding: 0.7rem 0.75rem;
  border-bottom: 1px solid #f3f4f6;
  color: #374151;
}
.pw-table tbody tr:last-child td {
  border-bottom: none;
}
.pw-table tbody tr:hover td {
  background: #eff6ff;
}
.pw-td-name {
  font-weight: 600;
  color: #1e3a8a;
}
.pw-badge {
  display: inline-block;
  padding: 0.2rem 0.6rem;
  border-radius: 9999px;
  font-size: 0.72rem;
  font-weight: 700;
}
.pw-badge.senate {
  background: #dbeafe;
  color: #1d4ed8;
}
.pw-badge.house {
  background: #e0e7ff;
  color: #4338ca;
}
.pw-status {
  display: inline-block;
  padding: 0.2rem 0.6rem;
  border-radius: 9999px;
  font-size: 0.72rem;
  font-weight: 700;
}
.pw-status.active {
  background: #d1fae5;
  color: #065f46;
}
.pw-status.inactive {
  background: #f3f4f6;
  color: #6b7280;
}

.pw-footer {
  background: #1e3a8a;
  padding: 1.25rem 1.5rem;
  text-align: center;
}
.pw-footer-text {
  font-size: 0.78rem;
  color: #93c5fd;
  margin: 0;
}

.pw-theme-btn {
  position: fixed;
  bottom: 1rem;
  left: 1rem;
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 50%;
  border: none;
  background: #1d4ed8;
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
.pw-theme-btn:hover {
  background: #2563eb;
}

[data-theme='dark'] .pw-root {
  background: #0f172a;
  color: #e2e8f0;
}
[data-theme='dark'] .pw-nav {
  background: #1e2d4a;
  border-color: #1e40af;
}
[data-theme='dark'] .pw-logo {
  color: #e2e8f0 !important;
}
[data-theme='dark'] .pw-logo-bottom {
  color: #93c5fd;
}
[data-theme='dark'] .pw-card {
  background: #1e2d4a;
  border-color: #1e40af;
  box-shadow: none;
}
[data-theme='dark'] .pw-card-label {
  color: #93c5fd;
}
[data-theme='dark'] .pw-fact {
  border-color: #1e3a5f;
}
[data-theme='dark'] .pw-fact-key {
  color: #9ca3af;
}
[data-theme='dark'] .pw-fact-val {
  color: #93c5fd;
}
[data-theme='dark'] .pw-about-text {
  color: #d1d5db;
}
[data-theme='dark'] .pw-meta-row {
  border-color: #1e3a5f;
}
[data-theme='dark'] .pw-meta-val {
  color: #93c5fd;
}
[data-theme='dark'] .pw-meta-active {
  color: #6ee7b7;
}
[data-theme='dark'] .pw-roster-title {
  color: #93c5fd !important;
  border-color: #1e40af;
}
[data-theme='dark'] .pw-table th {
  color: #9ca3af;
  border-color: #1e3a5f;
}
[data-theme='dark'] .pw-table td {
  border-color: #1e3a5f;
  color: #d1d5db;
}
[data-theme='dark'] .pw-table tbody tr:hover td {
  background: #1e3a5f;
}
[data-theme='dark'] .pw-td-name {
  color: #93c5fd;
}
[data-theme='dark'] .pw-footer {
  background: #070f1a;
}

@media (max-width: 700px) {
  .pw-info-row {
    grid-template-columns: 1fr;
  }
  .pw-masthead-title {
    font-size: 2rem;
  }
}
</style>
