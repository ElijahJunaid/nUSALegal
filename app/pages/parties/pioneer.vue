<template>
  <div class="party-wrapper">
    <nav class="party-nav">
      <div class="party-nav-inner">
        <NuxtLink to="/parties" class="party-logo">
          <span class="party-logo-icon">🔴</span>
          <div class="party-logo-text">
            <span class="party-logo-top">nUSA</span>
            <span class="party-logo-bottom">Pioneer Party</span>
          </div>
        </NuxtLink>
        <NuxtLink to="/parties" class="party-back-btn pioneer">← Back to Parties</NuxtLink>
      </div>
    </nav>

    <div class="party-masthead">
      <div class="party-masthead-inner">
        <div class="party-masthead-icon">🔴</div>
        <h1 class="party-masthead-title">Pioneer Party</h1>
        <p class="party-masthead-tagline">Tradition, strength, and pioneering nUSA values.</p>
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
            <span class="party-fact-value">Conservative</span>
          </div>
          <div class="party-fact-item">
            <span class="party-fact-label">Status</span>
            <span class="party-fact-value">Active</span>
          </div>
        </div>

        <div class="party-about-card">
          <h2 class="party-card-title">About the Pioneer Party</h2>
          <p class="party-about-text">
            The Pioneer Party stands for tradition, individual strength, and the founding values of
            nUSA. Rooted in conservative principles, Pioneer members work to preserve the
            institutions and liberties that define the nation while ensuring accountability across
            all branches of government.
          </p>
          <p class="party-about-text">
            With a commitment to limited government and personal responsibility, the Pioneer Party
            serves as a steadfast voice for nUSA citizens who value heritage and strength.
          </p>
          <a href="#" class="party-join-btn">Join the Pioneer Party →</a>
        </div>
      </div>

      <div class="party-roster">
        <h2 class="party-roster-title">Current Members of Congress</h2>
        <div v-if="congressStore.loading" class="party-roster-state">Loading members…</div>
        <div v-else-if="partyMembers.length === 0" class="party-roster-state">
          No current members of Congress affiliated with the Pioneer Party.
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

    <footer class="party-footer pioneer-footer">
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

const partyMembers = computed(() => congressStore.members.filter(m => m.party === 'Pioneer'))
const senateCount = computed(() => partyMembers.value.filter(m => m.chamber === 'Senate').length)
const houseCount = computed(() => partyMembers.value.filter(m => m.chamber === 'House').length)

onMounted(async () => {
  congressStore.loaded = false
  await congressStore.fetchMembers()
})

useHead({ title: 'Pioneer Party - nUSA' })
</script>

<style scoped>
.party-wrapper {
  min-height: 100vh;
  background: #fff5f5;
  font-family: 'Segoe UI', sans-serif;
  display: flex;
  flex-direction: column;
}

/* Nav */
.party-nav {
  background: #ffffff;
  border-bottom: 1px solid #fecaca;
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
  color: #b91c1c;
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
.party-back-btn.pioneer {
  background: #b91c1c;
  color: #ffffff;
}
.party-back-btn.pioneer:hover {
  background: #991b1b;
  color: #fff;
  text-decoration: none;
}

/* Masthead */
.party-masthead {
  background: linear-gradient(135deg, #7f1d1d 0%, #b91c1c 100%);
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
  color: #fecaca;
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
  border: 1px solid #fecaca;
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
  border-bottom: 1px solid #fff5f5;
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
  color: #7f1d1d;
}
.party-fact-total .party-fact-label {
  color: #b91c1c;
  font-weight: 600;
}
.party-fact-total .party-fact-value {
  font-size: 1rem;
  color: #b91c1c;
  background: #fee2e2;
  padding: 0.1rem 0.6rem;
  border-radius: 9999px;
}

/* About card */
.party-about-card {
  background: #ffffff;
  border: 1px solid #fecaca;
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
  background: #b91c1c;
  color: #ffffff;
  border-radius: 0.5rem;
  font-size: 0.85rem;
  font-weight: 700;
  text-decoration: none;
  transition: background 0.15s;
}
.party-join-btn:hover {
  background: #991b1b;
  color: #fff;
  text-decoration: none;
}

/* Roster */
.party-roster {
  background: #ffffff;
  border: 1px solid #fecaca;
  border-radius: 0.75rem;
  padding: 1.75rem;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
}
.party-roster-title {
  font-size: 1rem;
  font-weight: 700;
  color: #7f1d1d;
  margin-bottom: 1.25rem;
  padding-bottom: 0.6rem;
  border-bottom: 2px solid #fecaca;
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
  background: #fff5f5;
}
.roster-name {
  font-weight: 600;
  color: #7f1d1d;
}
.roster-badge {
  display: inline-block;
  padding: 0.2rem 0.6rem;
  border-radius: 9999px;
  font-size: 0.72rem;
  font-weight: 700;
}
.roster-badge.senate {
  background: #fee2e2;
  color: #b91c1c;
}
.roster-badge.house {
  background: #fef3c7;
  color: #92400e;
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
.pioneer-footer {
  background: #7f1d1d;
}
.party-footer-bottom {
  font-size: 0.78rem;
  color: #fca5a5;
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
  background: #b91c1c;
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
  background: #dc2626;
}

/* Dark mode */
[data-theme='dark'] .party-wrapper {
  background: #1a0505;
}
[data-theme='dark'] .party-nav {
  background: #2d0a0a;
  border-color: #7f1d1d;
}
[data-theme='dark'] .party-logo-bottom {
  color: #fca5a5;
}
[data-theme='dark'] .party-content {
  background: #1a0505;
}
[data-theme='dark'] .party-facts-card,
[data-theme='dark'] .party-about-card,
[data-theme='dark'] .party-roster {
  background: #2d1515;
  border-color: #7f1d1d;
}
[data-theme='dark'] .party-card-title {
  color: #fca5a5;
}
[data-theme='dark'] .party-fact-item {
  border-color: #3d1010;
}
[data-theme='dark'] .party-fact-label {
  color: #9ca3af;
}
[data-theme='dark'] .party-fact-value {
  color: #fca5a5;
}
[data-theme='dark'] .party-about-text {
  color: #d1d5db;
}
[data-theme='dark'] .party-roster-title {
  color: #fca5a5;
  border-color: #7f1d1d;
}
[data-theme='dark'] .party-roster-table th {
  color: #9ca3af;
  border-color: #3d1010;
}
[data-theme='dark'] .party-roster-table td {
  border-color: #3d1010;
  color: #d1d5db;
}
[data-theme='dark'] .party-roster-table tbody tr:hover td {
  background: #3d1010;
}
[data-theme='dark'] .roster-name {
  color: #fca5a5;
}
[data-theme='dark'] .party-footer {
  background: #100202;
}
[data-theme='dark'] .party-footer-bottom {
  color: #fca5a5;
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
