<template>
  <div class="party-wrapper">
    <nav class="party-nav">
      <div class="party-nav-inner">
        <NuxtLink to="/parties" class="party-logo">
          <span class="party-logo-icon">🔵</span>
          <div class="party-logo-text">
            <span class="party-logo-top">nUSA</span>
            <span class="party-logo-bottom">Forward Party</span>
          </div>
        </NuxtLink>
        <NuxtLink to="/parties" class="party-back-btn forward">← Back to Parties</NuxtLink>
      </div>
    </nav>

    <div class="party-masthead">
      <div class="party-masthead-inner">
        <div class="party-masthead-icon">🔵</div>
        <h1 class="party-masthead-title">Forward Party</h1>
        <p class="party-masthead-tagline">Progress, unity, and a forward-looking nUSA.</p>
      </div>
    </div>

    <div class="party-content">
      <div class="party-info-row">
        <div class="party-facts-card">
          <h2 class="party-card-title">Quick Facts</h2>
          <div class="party-fact-item">
            <span class="party-fact-label">Senate Seats</span>
            <span class="party-fact-value">{{ senateCount }}</span>
          </div>
          <div class="party-fact-item">
            <span class="party-fact-label">House Seats</span>
            <span class="party-fact-value">{{ houseCount }}</span>
          </div>
          <div class="party-fact-item party-fact-total">
            <span class="party-fact-label">Total Members</span>
            <span class="party-fact-value">{{ partyMembers.length }}</span>
          </div>
          <div class="party-fact-item">
            <span class="party-fact-label">Ideology</span>
            <span class="party-fact-value">Progressive</span>
          </div>
          <div class="party-fact-item">
            <span class="party-fact-label">Status</span>
            <span class="party-fact-value">Active</span>
          </div>
        </div>

        <div class="party-about-card">
          <h2 class="party-card-title">About the Forward Party</h2>
          <p class="party-about-text">
            The Forward Party champions progress, unity, and a modern vision for nUSA. Committed to
            building inclusive institutions and forward-thinking policy, Forward members serve
            across both chambers of Congress working toward a stronger, more connected nation.
          </p>
          <p class="party-about-text">
            Founded on the principles of civic engagement and collaborative governance, the Forward
            Party represents those who believe that nUSA's best days are ahead.
          </p>
          <a href="#" class="party-join-btn">Join the Forward Party →</a>
        </div>
      </div>

      <div class="party-roster">
        <h2 class="party-roster-title">Current Members of Congress</h2>
        <div v-if="congressStore.loading" class="party-roster-state">Loading members…</div>
        <div v-else-if="partyMembers.length === 0" class="party-roster-state">
          No current members of Congress affiliated with the Forward Party.
        </div>
        <div v-else class="party-roster-table-wrap">
          <table class="party-roster-table">
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
                <td class="roster-name">{{ m.name }}</td>
                <td>{{ m.role }}</td>
                <td>{{ m.state }}</td>
                <td>
                  <span class="roster-badge" :class="m.chamber.toLowerCase()">{{ m.chamber }}</span>
                </td>
                <td>
                  <span class="roster-status" :class="m.status.toLowerCase()">{{ m.status }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <footer class="party-footer forward-footer">
      <div class="party-footer-bottom">
        <p>&copy; 2024 nUSA Political Parties · THIS IS NOT REAL LIFE!</p>
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

definePageMeta({ layout: false })

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
.party-wrapper {
  min-height: 100vh;
  background: #f0f6ff;
  font-family: 'Segoe UI', sans-serif;
  display: flex;
  flex-direction: column;
}

/* Nav */
.party-nav {
  background: #ffffff;
  border-bottom: 1px solid #bfdbfe;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
}
.party-nav-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.party-logo {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  text-decoration: none;
}
.party-logo-icon {
  font-size: 1.4rem;
}
.party-logo-text {
  display: flex;
  flex-direction: column;
  line-height: 1.1;
}
.party-logo-top {
  font-size: 0.65rem;
  font-weight: 700;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.party-logo-bottom {
  font-size: 0.85rem;
  font-weight: 700;
  color: #1d4ed8;
}
.party-back-btn {
  padding: 0.4rem 1rem;
  border-radius: 0.375rem;
  font-size: 0.8rem;
  font-weight: 600;
  text-decoration: none;
  white-space: nowrap;
  transition: background 0.15s;
}
.party-back-btn.forward {
  background: #1d4ed8;
  color: #ffffff;
}
.party-back-btn.forward:hover {
  background: #1e40af;
  color: #fff;
  text-decoration: none;
}

/* Masthead */
.party-masthead {
  background: linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 100%);
  padding: 3.5rem 1.5rem 3rem;
  text-align: center;
}
.party-masthead-inner {
  max-width: 640px;
  margin: 0 auto;
}
.party-masthead-icon {
  font-size: 3rem;
  margin-bottom: 0.85rem;
}
.party-masthead-title {
  font-size: 2.75rem;
  font-weight: 800;
  color: #ffffff;
  line-height: 1.1;
  margin-bottom: 0.65rem;
}
.party-masthead-tagline {
  font-size: 1rem;
  color: #bfdbfe;
}

/* Content */
.party-content {
  flex: 1;
  max-width: 960px;
  margin: 0 auto;
  padding: 2.5rem 1.5rem;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

/* Info row */
.party-info-row {
  display: grid;
  grid-template-columns: 260px 1fr;
  gap: 1.5rem;
  align-items: start;
}

/* Facts card */
.party-facts-card {
  background: #ffffff;
  border: 1px solid #bfdbfe;
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
}
.party-card-title {
  font-size: 0.8rem;
  font-weight: 700;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  margin-bottom: 0.75rem;
}
.party-fact-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.55rem 0;
  border-bottom: 1px solid #f0f6ff;
}
.party-fact-item:last-child {
  border-bottom: none;
}
.party-fact-label {
  font-size: 0.85rem;
  color: #6b7280;
}
.party-fact-value {
  font-size: 0.875rem;
  font-weight: 700;
  color: #1e3a8a;
}
.party-fact-total .party-fact-label {
  color: #1d4ed8;
  font-weight: 600;
}
.party-fact-total .party-fact-value {
  font-size: 1rem;
  color: #1d4ed8;
  background: #dbeafe;
  padding: 0.1rem 0.6rem;
  border-radius: 9999px;
}

/* About card */
.party-about-card {
  background: #ffffff;
  border: 1px solid #bfdbfe;
  border-radius: 0.75rem;
  padding: 1.75rem;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
.party-about-text {
  font-size: 0.9rem;
  color: #374151;
  line-height: 1.75;
}
.party-join-btn {
  align-self: flex-start;
  margin-top: 0.5rem;
  padding: 0.55rem 1.25rem;
  background: #1d4ed8;
  color: #ffffff;
  border-radius: 0.5rem;
  font-size: 0.85rem;
  font-weight: 700;
  text-decoration: none;
  transition: background 0.15s;
}
.party-join-btn:hover {
  background: #1e40af;
  color: #fff;
  text-decoration: none;
}

/* Roster */
.party-roster {
  background: #ffffff;
  border: 1px solid #bfdbfe;
  border-radius: 0.75rem;
  padding: 1.75rem;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
}
.party-roster-title {
  font-size: 1rem;
  font-weight: 700;
  color: #1e3a8a;
  margin-bottom: 1.25rem;
  padding-bottom: 0.6rem;
  border-bottom: 2px solid #bfdbfe;
}
.party-roster-state {
  font-size: 0.875rem;
  color: #9ca3af;
  padding: 1rem 0;
}
.party-roster-table-wrap {
  overflow-x: auto;
}
.party-roster-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
}
.party-roster-table th {
  text-align: left;
  padding: 0.6rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 700;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 1px solid #e5e7eb;
}
.party-roster-table td {
  padding: 0.75rem;
  border-bottom: 1px solid #f3f4f6;
  color: #374151;
}
.party-roster-table tbody tr:last-child td {
  border-bottom: none;
}
.party-roster-table tbody tr:hover td {
  background: #eff6ff;
}
.roster-name {
  font-weight: 600;
  color: #1e3a8a;
}
.roster-badge {
  display: inline-block;
  padding: 0.2rem 0.6rem;
  border-radius: 9999px;
  font-size: 0.72rem;
  font-weight: 700;
}
.roster-badge.senate {
  background: #dbeafe;
  color: #1d4ed8;
}
.roster-badge.house {
  background: #e0e7ff;
  color: #4338ca;
}
.roster-status {
  display: inline-block;
  padding: 0.2rem 0.6rem;
  border-radius: 9999px;
  font-size: 0.72rem;
  font-weight: 700;
}
.roster-status.active {
  background: #d1fae5;
  color: #065f46;
}
.roster-status.inactive {
  background: #f3f4f6;
  color: #6b7280;
}

/* Footer */
.party-footer {
  padding: 1.25rem 1.5rem;
  text-align: center;
}
.forward-footer {
  background: #1e3a8a;
}
.party-footer-bottom {
  font-size: 0.78rem;
  color: #93c5fd;
}

/* Theme toggle */
.theme-toggle {
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
.theme-toggle:hover {
  background: #2563eb;
}

/* Dark mode */
[data-theme='dark'] .party-wrapper {
  background: #0f172a;
}
[data-theme='dark'] .party-nav {
  background: #1e3a5f;
  border-color: #1e40af;
}
[data-theme='dark'] .party-logo-bottom {
  color: #93c5fd;
}
[data-theme='dark'] .party-content {
  background: #0f172a;
}
[data-theme='dark'] .party-facts-card,
[data-theme='dark'] .party-about-card,
[data-theme='dark'] .party-roster {
  background: #1e2d4a;
  border-color: #1e40af;
}
[data-theme='dark'] .party-card-title {
  color: #93c5fd;
}
[data-theme='dark'] .party-fact-item {
  border-color: #1e3a5f;
}
[data-theme='dark'] .party-fact-label {
  color: #9ca3af;
}
[data-theme='dark'] .party-fact-value {
  color: #93c5fd;
}
[data-theme='dark'] .party-about-text {
  color: #d1d5db;
}
[data-theme='dark'] .party-roster-title {
  color: #93c5fd;
  border-color: #1e40af;
}
[data-theme='dark'] .party-roster-table th {
  color: #9ca3af;
  border-color: #1e3a5f;
}
[data-theme='dark'] .party-roster-table td {
  border-color: #1e3a5f;
  color: #d1d5db;
}
[data-theme='dark'] .party-roster-table tbody tr:hover td {
  background: #1e3a5f;
}
[data-theme='dark'] .roster-name {
  color: #93c5fd;
}
[data-theme='dark'] .party-footer {
  background: #070f1a;
}
[data-theme='dark'] .party-footer-bottom {
  color: #93c5fd;
}

@media (max-width: 700px) {
  .party-info-row {
    grid-template-columns: 1fr;
  }
  .party-masthead-title {
    font-size: 2rem;
  }
}
</style>
