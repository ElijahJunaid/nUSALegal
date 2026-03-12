<template>
  <div class="pp-root">
    <!-- Nav -->
    <nav class="pp-nav">
      <div class="pp-nav-inner">
        <NuxtLink to="/parties" class="pp-logo">
          <span class="pp-logo-icon">🔴</span>
          <div class="pp-logo-text">
            <span class="pp-logo-top">nUSA</span>
            <span class="pp-logo-bottom">Pioneer Party</span>
          </div>
        </NuxtLink>
        <NuxtLink to="/parties" class="pp-back-btn">← Back to Parties</NuxtLink>
      </div>
    </nav>

    <!-- Masthead -->
    <div class="pp-masthead">
      <div class="pp-masthead-inner">
        <div class="pp-masthead-icon">🔴</div>
        <h1 class="pp-masthead-title">Pioneer Party</h1>
        <p class="pp-masthead-tagline">Tradition, strength, and pioneering nUSA values.</p>
      </div>
    </div>

    <!-- Content -->
    <div class="pp-content">
      <!-- Two-column info row -->
      <div class="pp-info-row">
        <!-- Quick Facts -->
        <div class="pp-card">
          <h2 class="pp-card-label">Quick Facts</h2>
          <div class="pp-fact">
            <span class="pp-fact-key">Senate Seats</span>
            <span class="pp-fact-val">{{ senateCount }}</span>
          </div>
          <div class="pp-fact">
            <span class="pp-fact-key">House Seats</span>
            <span class="pp-fact-val">{{ houseCount }}</span>
          </div>
          <div class="pp-fact pp-fact-total">
            <span class="pp-fact-key pp-fact-key-total">Total Members</span>
            <span class="pp-fact-val pp-fact-val-total">{{ partyMembers.length }}</span>
          </div>
        </div>

        <!-- About -->
        <div class="pp-card pp-about-card">
          <h2 class="pp-card-label">About the Pioneer Party</h2>
          <p class="pp-about-text">
            The Pioneer Party stands for tradition, individual strength, and the founding values of
            nUSA. Rooted in conservative principles, Pioneer members work to preserve the
            institutions and liberties that define the nation while ensuring accountability across
            all branches of government.
          </p>
          <p class="pp-about-text">
            With a commitment to limited government and personal responsibility, the Pioneer Party
            serves as a steadfast voice for nUSA citizens who value heritage and strength.
          </p>
          <div class="pp-meta-row">
            <div class="pp-meta-item">
              <span class="pp-meta-key">Founded</span>
              <span class="pp-meta-val">2024</span>
            </div>
            <div class="pp-meta-item">
              <span class="pp-meta-key">Ideology</span>
              <span class="pp-meta-val">Conservative</span>
            </div>
            <div class="pp-meta-item">
              <span class="pp-meta-key">Status</span>
              <span class="pp-meta-val pp-meta-active">Active</span>
            </div>
          </div>
          <a href="#" class="pp-join-btn">Join the Pioneer Party →</a>
        </div>
      </div>

      <!-- Roster -->
      <div class="pp-card">
        <h2 class="pp-roster-title">Current Members of Congress</h2>
        <div v-if="congressStore.loading" class="pp-empty">Loading members…</div>
        <div v-else-if="partyMembers.length === 0" class="pp-empty">
          No current members of Congress affiliated with the Pioneer Party.
        </div>
        <div v-else class="pp-table-wrap">
          <table class="pp-table">
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
                <td class="pp-td-name">{{ m.name }}</td>
                <td>{{ m.role }}</td>
                <td>{{ m.state }}</td>
                <td>
                  <span class="pp-badge" :class="m.chamber.toLowerCase()">{{ m.chamber }}</span>
                </td>
                <td>
                  <span class="pp-status" :class="m.status.toLowerCase()">{{ m.status }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <footer class="pp-footer">
      <p class="pp-footer-text">&copy; 2024 nUSA Political Parties · THIS IS NOT REAL LIFE!</p>
    </footer>

    <button
      @click="toggleTheme"
      class="pp-theme-btn"
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
/* ── Root ── */
.pp-root {
  min-height: 100vh;
  background: #fff5f5;
  font-family: 'Segoe UI', Tahoma, sans-serif;
  display: flex;
  flex-direction: column;
  color: #1f2937;
}

/* ── Nav ── */
.pp-nav {
  background: #ffffff;
  border-bottom: 2px solid #fecaca;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.07);
}
.pp-nav-inner {
  max-width: 960px;
  margin: 0 auto;
  padding: 0 1.5rem;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.pp-logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none !important;
  color: #1f2937 !important;
}
.pp-logo-icon {
  font-size: 1.4rem;
}
.pp-logo-text {
  display: flex;
  flex-direction: column;
  line-height: 1.15;
}
.pp-logo-top {
  font-size: 0.62rem;
  font-weight: 700;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}
.pp-logo-bottom {
  font-size: 0.82rem;
  font-weight: 700;
  color: #b91c1c;
}
.pp-back-btn {
  padding: 0.4rem 1rem;
  border-radius: 0.375rem;
  font-size: 0.8rem;
  font-weight: 600;
  text-decoration: none !important;
  background: #b91c1c;
  color: #ffffff !important;
  transition: background 0.15s;
  white-space: nowrap;
}
.pp-back-btn:hover {
  background: #991b1b;
}

/* ── Masthead ── */
.pp-masthead {
  background: linear-gradient(135deg, #7f1d1d 0%, #b91c1c 100%);
  padding: 3.5rem 1.5rem 3rem;
  text-align: center;
}
.pp-masthead-inner {
  max-width: 600px;
  margin: 0 auto;
}
.pp-masthead-icon {
  font-size: 3rem;
  margin-bottom: 0.75rem;
}
.pp-masthead-title {
  font-size: 2.75rem;
  font-weight: 800;
  color: #ffffff !important;
  line-height: 1.1;
  margin-bottom: 0.5rem;
}
.pp-masthead-tagline {
  font-size: 1rem;
  color: #fecaca;
}

/* ── Content ── */
.pp-content {
  flex: 1;
  max-width: 960px;
  margin: 0 auto;
  width: 100%;
  padding: 2.5rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
}

/* ── Two-column info row ── */
.pp-info-row {
  display: grid;
  grid-template-columns: 260px 1fr;
  gap: 1.5rem;
  align-items: start;
}

/* ── Card ── */
.pp-card {
  background: #ffffff;
  border: 1.5px solid #fecaca;
  border-radius: 0.875rem;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(185, 28, 28, 0.07);
}
.pp-about-card {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
.pp-card-label {
  font-size: 0.72rem;
  font-weight: 700;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 0.75rem;
}

/* ── Quick Facts ── */
.pp-fact {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid #fff5f5;
}
.pp-fact:last-of-type {
  border-bottom: none;
}
.pp-fact-key {
  font-size: 0.84rem;
  color: #6b7280;
}
.pp-fact-val {
  font-size: 0.875rem;
  font-weight: 700;
  color: #7f1d1d;
}
.pp-fact-key-total {
  color: #b91c1c;
  font-weight: 600;
}
.pp-fact-val-total {
  font-size: 0.875rem;
  color: #b91c1c;
  background: #fee2e2;
  padding: 0.15rem 0.65rem;
  border-radius: 9999px;
}

/* ── About ── */
.pp-about-text {
  font-size: 0.875rem;
  color: #374151;
  line-height: 1.75;
  margin: 0;
}
.pp-meta-row {
  display: flex;
  gap: 1.5rem;
  padding-top: 0.75rem;
  border-top: 1px solid #fff5f5;
  flex-wrap: wrap;
}
.pp-meta-item {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}
.pp-meta-key {
  font-size: 0.68rem;
  font-weight: 700;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.07em;
}
.pp-meta-val {
  font-size: 0.875rem;
  font-weight: 700;
  color: #7f1d1d;
}
.pp-meta-active {
  color: #065f46;
}
.pp-join-btn {
  align-self: flex-start;
  margin-top: 0.25rem;
  padding: 0.5rem 1.2rem;
  background: #b91c1c;
  color: #ffffff !important;
  border-radius: 0.5rem;
  font-size: 0.84rem;
  font-weight: 700;
  text-decoration: none !important;
  transition: background 0.15s;
  display: inline-block;
}
.pp-join-btn:hover {
  background: #991b1b;
}

/* ── Roster ── */
.pp-roster-title {
  font-size: 1rem;
  font-weight: 700;
  color: #7f1d1d !important;
  margin-bottom: 1rem;
  padding-bottom: 0.6rem;
  border-bottom: 2px solid #fecaca;
}
.pp-empty {
  font-size: 0.875rem;
  color: #9ca3af;
  padding: 1rem 0;
}
.pp-table-wrap {
  overflow-x: auto;
}
.pp-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
}
.pp-table th {
  text-align: left;
  padding: 0.55rem 0.75rem;
  font-size: 0.72rem;
  font-weight: 700;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 1.5px solid #e5e7eb;
}
.pp-table td {
  padding: 0.7rem 0.75rem;
  border-bottom: 1px solid #f3f4f6;
  color: #374151;
}
.pp-table tbody tr:last-child td {
  border-bottom: none;
}
.pp-table tbody tr:hover td {
  background: #fff5f5;
}
.pp-td-name {
  font-weight: 600;
  color: #7f1d1d;
}
.pp-badge {
  display: inline-block;
  padding: 0.2rem 0.6rem;
  border-radius: 9999px;
  font-size: 0.72rem;
  font-weight: 700;
}
.pp-badge.senate {
  background: #fee2e2;
  color: #b91c1c;
}
.pp-badge.house {
  background: #fef3c7;
  color: #92400e;
}
.pp-status {
  display: inline-block;
  padding: 0.2rem 0.6rem;
  border-radius: 9999px;
  font-size: 0.72rem;
  font-weight: 700;
}
.pp-status.active {
  background: #d1fae5;
  color: #065f46;
}
.pp-status.inactive {
  background: #f3f4f6;
  color: #6b7280;
}

/* ── Footer ── */
.pp-footer {
  background: #7f1d1d;
  padding: 1.25rem 1.5rem;
  text-align: center;
}
.pp-footer-text {
  font-size: 0.78rem;
  color: #fca5a5;
  margin: 0;
}

/* ── Theme toggle ── */
.pp-theme-btn {
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
.pp-theme-btn:hover {
  background: #dc2626;
}

/* ── Dark mode ── */
[data-theme='dark'] .pp-root {
  background: #1a0505;
  color: #e2e8f0;
}
[data-theme='dark'] .pp-nav {
  background: #2d0a0a;
  border-color: #7f1d1d;
}
[data-theme='dark'] .pp-logo {
  color: #e2e8f0 !important;
}
[data-theme='dark'] .pp-logo-bottom {
  color: #fca5a5;
}
[data-theme='dark'] .pp-card {
  background: #2d1515;
  border-color: #7f1d1d;
  box-shadow: none;
}
[data-theme='dark'] .pp-card-label {
  color: #fca5a5;
}
[data-theme='dark'] .pp-fact {
  border-color: #3d1010;
}
[data-theme='dark'] .pp-fact-key {
  color: #9ca3af;
}
[data-theme='dark'] .pp-fact-val {
  color: #fca5a5;
}
[data-theme='dark'] .pp-about-text {
  color: #d1d5db;
}
[data-theme='dark'] .pp-meta-row {
  border-color: #3d1010;
}
[data-theme='dark'] .pp-meta-val {
  color: #fca5a5;
}
[data-theme='dark'] .pp-meta-active {
  color: #6ee7b7;
}
[data-theme='dark'] .pp-roster-title {
  color: #fca5a5 !important;
  border-color: #7f1d1d;
}
[data-theme='dark'] .pp-table th {
  color: #9ca3af;
  border-color: #3d1010;
}
[data-theme='dark'] .pp-table td {
  border-color: #3d1010;
  color: #d1d5db;
}
[data-theme='dark'] .pp-table tbody tr:hover td {
  background: #3d1010;
}
[data-theme='dark'] .pp-td-name {
  color: #fca5a5;
}
[data-theme='dark'] .pp-footer {
  background: #100202;
}

/* ── Responsive ── */
@media (max-width: 700px) {
  .pp-info-row {
    grid-template-columns: 1fr;
  }
  .pp-masthead-title {
    font-size: 2rem;
  }
}
</style>
