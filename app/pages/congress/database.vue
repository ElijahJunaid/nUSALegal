<template>
  <div class="loc-wrapper">
    <!-- Navbar -->
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
          <NuxtLink to="/congress/database" class="loc-nav-link active">Congress Database</NuxtLink>
          <NuxtLink to="/congress/former-members" class="loc-nav-link">Former Members</NuxtLink>
          <NuxtLink to="/congress/about" class="loc-nav-link">About</NuxtLink>
        </div>
        <NuxtLink to="/congress" class="loc-back-btn">← Back to nUSA</NuxtLink>
      </div>
    </nav>

    <div class="db-page">
      <!-- Page Header -->
      <div class="db-header">
        <h1 class="db-title">🏛️ Congressional Database</h1>
        <p class="db-subtitle">
          Explore the complete record of current and former members of the nUSA Congress.
        </p>
      </div>

      <!-- Seat Distribution -->
      <div class="db-panel">
        <h2 class="db-panel-title">📊 Seat Distribution — Current Members</h2>
        <div class="db-charts">
          <div class="db-chart-item">
            <p class="db-chart-label">Total Congress</p>
            <p class="db-chart-num">{{ totalMembers }}</p>
            <svg class="donut" viewBox="0 0 120 120">
              <circle class="donut-bg" cx="60" cy="60" r="45" />
              <circle
                class="donut-seg forward"
                cx="60"
                cy="60"
                r="45"
                :stroke-dasharray="`${forwardPct * 2.827} ${(1 - forwardPct) * 2.827 * 100}`"
                stroke-dashoffset="70.7"
              />
              <circle
                class="donut-seg pioneer"
                cx="60"
                cy="60"
                r="45"
                :stroke-dasharray="`${pioneerPct * 2.827} ${(1 - pioneerPct) * 2.827 * 100}`"
                :stroke-dashoffset="`${70.7 - forwardPct * 282.7}`"
              />
            </svg>
          </div>
          <div class="db-chart-item">
            <p class="db-chart-label">Senate</p>
            <p class="db-chart-num">{{ senateMembers.length }}</p>
            <svg class="donut" viewBox="0 0 120 120">
              <circle class="donut-bg" cx="60" cy="60" r="45" />
              <circle
                class="donut-seg forward"
                cx="60"
                cy="60"
                r="45"
                :stroke-dasharray="`${(senateForward / senateMembers.length) * 282.7} 282.7`"
                stroke-dashoffset="70.7"
              />
              <circle
                class="donut-seg pioneer"
                cx="60"
                cy="60"
                r="45"
                :stroke-dasharray="`${(senatePioneer / senateMembers.length) * 282.7} 282.7`"
                :stroke-dashoffset="`${70.7 - (senateForward / senateMembers.length) * 282.7}`"
              />
            </svg>
          </div>
          <div class="db-chart-item">
            <p class="db-chart-label">House</p>
            <p class="db-chart-num">{{ houseMembers.length }}</p>
            <svg class="donut" viewBox="0 0 120 120">
              <circle class="donut-bg" cx="60" cy="60" r="45" />
              <circle
                class="donut-seg forward"
                cx="60"
                cy="60"
                r="45"
                :stroke-dasharray="`${(houseForward / houseMembers.length) * 282.7} 282.7`"
                stroke-dashoffset="70.7"
              />
              <circle
                class="donut-seg pioneer"
                cx="60"
                cy="60"
                r="45"
                :stroke-dasharray="`${(housePioneer / houseMembers.length) * 282.7} 282.7`"
                :stroke-dashoffset="`${70.7 - (houseForward / houseMembers.length) * 282.7}`"
              />
            </svg>
          </div>
        </div>
        <div class="db-legend">
          <span class="db-legend-item forward">● Forward {{ allForward }}</span>
          <span class="db-legend-item pioneer">● Pioneer {{ allPioneer }}</span>
        </div>
      </div>

      <!-- State Map -->
      <div class="db-panel">
        <h2 class="db-panel-title">📍 State Representation Map</h2>
        <p class="db-panel-sub">Click a state to filter members. Color indicates dominant party.</p>
        <div class="state-grid">
          <div
            v-for="cell in stateGrid"
            :key="cell.abbr || cell.id"
            :class="[
              'state-cell',
              cell.party,
              { empty: !cell.abbr, active: selectedState === cell.abbr }
            ]"
            @click="cell.abbr ? selectState(cell.abbr) : null"
          >
            <template v-if="cell.abbr">
              <span class="state-abbr">{{ cell.abbr }}</span>
              <span v-if="cell.count" class="state-count">{{ cell.count }}</span>
            </template>
          </div>
        </div>
        <div class="state-legend">
          <span class="state-leg forward">■ Forward</span>
          <span class="state-leg pioneer">■ Pioneer</span>
          <span class="state-leg independent">■ Independent</span>
          <span class="state-leg none">■ No members</span>
        </div>
      </div>

      <!-- Search + Filters -->
      <div class="db-search-bar">
        <div class="db-search-input-wrap">
          <span class="db-search-icon">🔍</span>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search by name, state, or username..."
            class="db-search-input"
          />
        </div>
        <select v-model="filterStatus" class="db-filter">
          <option value="">All Status</option>
          <option value="Active">Active</option>
          <option value="Former">Former</option>
        </select>
        <select v-model="filterChamber" class="db-filter">
          <option value="">All Chambers</option>
          <option value="Senate">Senate</option>
          <option value="House">House</option>
        </select>
        <select v-model="filterParty" class="db-filter">
          <option value="">All Parties</option>
          <option value="Forward">Forward</option>
          <option value="Pioneer">Pioneer</option>
          <option value="Independent">Independent</option>
        </select>
      </div>

      <!-- Senate Listing -->
      <div v-if="!filterChamber || filterChamber === 'Senate'" class="db-section">
        <h2 class="db-section-title">Senate ({{ filteredSenate.length }})</h2>
        <div class="db-member-list">
          <div v-for="m in filteredSenate" :key="m.username" class="db-member-card">
            <div class="db-member-avatar">{{ m.initials }}</div>
            <div class="db-member-info">
              <div class="db-member-row">
                <p class="db-member-name">{{ m.name }}</p>
                <span :class="['db-status', m.status === 'Active' ? 'active' : 'former']">
                  {{ m.status }}
                </span>
              </div>
              <p class="db-member-title">{{ m.role }}</p>
              <p class="db-member-user">@{{ m.username }}</p>
              <div class="db-member-tags">
                <span v-if="m.state" class="loc-tag-state">{{ m.state }}</span>
                <span :class="['loc-tag-party', m.party === 'Forward' ? 'forward' : 'pioneer']">
                  {{ m.party }}
                </span>
                <span class="loc-tag-chamber">Senate</span>
              </div>
            </div>
          </div>
          <p v-if="filteredSenate.length === 0" class="db-empty">No members match your filters.</p>
        </div>
      </div>

      <!-- House Listing -->
      <div v-if="!filterChamber || filterChamber === 'House'" class="db-section">
        <h2 class="db-section-title">House ({{ filteredHouse.length }})</h2>
        <div class="db-member-list">
          <div v-for="m in filteredHouse" :key="m.username" class="db-member-card">
            <div class="db-member-avatar">{{ m.initials }}</div>
            <div class="db-member-info">
              <div class="db-member-row">
                <p class="db-member-name">{{ m.name }}</p>
                <span :class="['db-status', m.status === 'Active' ? 'active' : 'former']">
                  {{ m.status }}
                </span>
              </div>
              <p class="db-member-title">{{ m.role }}</p>
              <p class="db-member-user">@{{ m.username }}</p>
              <div class="db-member-tags">
                <span v-if="m.state" class="loc-tag-state">{{ m.state }}</span>
                <span :class="['loc-tag-party', m.party === 'Forward' ? 'forward' : 'pioneer']">
                  {{ m.party }}
                </span>
                <span class="loc-tag-chamber">House</span>
              </div>
            </div>
          </div>
          <p v-if="filteredHouse.length === 0" class="db-empty">No members match your filters.</p>
        </div>
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
import { storeToRefs } from 'pinia'
import { useCongressStore } from '~/stores/congress-store'
import type { CongressMember } from '~/stores/congress-store'
import { useTheme } from '~/composables/useTheme'

const { theme, toggleTheme } = useTheme()
const congressStore = useCongressStore()
const { senateMembers, houseMembers } = storeToRefs(congressStore)

const searchQuery = ref('')
const filterStatus = ref('')
const filterChamber = ref('')
const filterParty = ref('')
const selectedState = ref('')

const totalMembers = computed(() => congressStore.members.length)
const allForward = computed(() => congressStore.members.filter(m => m.party === 'Forward').length)
const allPioneer = computed(() => congressStore.members.filter(m => m.party === 'Pioneer').length)
const forwardPct = computed(() => (totalMembers.value ? allForward.value / totalMembers.value : 0))
const pioneerPct = computed(() => (totalMembers.value ? allPioneer.value / totalMembers.value : 0))
const senateForward = computed(() => senateMembers.value.filter(m => m.party === 'Forward').length)
const senatePioneer = computed(() => senateMembers.value.filter(m => m.party === 'Pioneer').length)
const houseForward = computed(() => houseMembers.value.filter(m => m.party === 'Forward').length)
const housePioneer = computed(() => houseMembers.value.filter(m => m.party === 'Pioneer').length)

function applyFilters(list: CongressMember[]) {
  return list.filter(m => {
    const q = searchQuery.value.toLowerCase()
    const matchQ =
      !q ||
      m.name.toLowerCase().includes(q) ||
      m.username.toLowerCase().includes(q) ||
      m.state.toLowerCase().includes(q)
    const matchStatus = !filterStatus.value || m.status === filterStatus.value
    const matchParty = !filterParty.value || m.party === filterParty.value
    const matchState = !selectedState.value || m.state === selectedState.value
    return matchQ && matchStatus && matchParty && matchState
  })
}

const filteredSenate = computed(() => applyFilters(senateMembers.value))
const filteredHouse = computed(() => applyFilters(houseMembers.value))

function selectState(abbr: string) {
  selectedState.value = selectedState.value === abbr ? '' : abbr
}

interface StateCell {
  id: string
  abbr: string
  party: string
  count: number
}

const stateGrid = computed<StateCell[]>(() => {
  const stateCounts: Record<string, { count: number; parties: string[] }> = {}
  congressStore.members.forEach(m => {
    if (!m.state) return
    const abbr = stateAbbr(m.state)
    if (!abbr) return
    if (!stateCounts[abbr]) stateCounts[abbr] = { count: 0, parties: [] }
    stateCounts[abbr].count++
    stateCounts[abbr].parties.push(m.party)
  })

  return usGridLayout.map((abbr, i) => {
    if (!abbr) return { id: `empty-${i}`, abbr: '', party: '', count: 0 }
    const data = stateCounts[abbr]
    let party = 'none'
    if (data) {
      const fwd = data.parties.filter(p => p === 'Forward').length
      const pio = data.parties.filter(p => p === 'Pioneer').length
      party = fwd > pio ? 'forward' : pio > fwd ? 'pioneer' : 'independent'
    }
    return { id: abbr, abbr, party, count: data?.count || 0 }
  })
})

function stateAbbr(name: string): string {
  if (name.length === 2 && name === name.toUpperCase()) return name
  const map: Record<string, string> = {
    Alabama: 'AL',
    Alaska: 'AK',
    Arizona: 'AZ',
    Arkansas: 'AR',
    California: 'CA',
    Colorado: 'CO',
    Connecticut: 'CT',
    Delaware: 'DE',
    Florida: 'FL',
    Georgia: 'GA',
    Hawaii: 'HI',
    Idaho: 'ID',
    Illinois: 'IL',
    Indiana: 'IN',
    Iowa: 'IA',
    Kansas: 'KS',
    Kentucky: 'KY',
    Louisiana: 'LA',
    Maine: 'ME',
    Maryland: 'MD',
    Massachusetts: 'MA',
    Michigan: 'MI',
    Minnesota: 'MN',
    Mississippi: 'MS',
    Missouri: 'MO',
    Montana: 'MT',
    Nebraska: 'NE',
    Nevada: 'NV',
    'New Hampshire': 'NH',
    'New Jersey': 'NJ',
    'New Mexico': 'NM',
    'New York': 'NY',
    'North Carolina': 'NC',
    'North Dakota': 'ND',
    Ohio: 'OH',
    Oklahoma: 'OK',
    Oregon: 'OR',
    Pennsylvania: 'PA',
    'Rhode Island': 'RI',
    'South Carolina': 'SC',
    'South Dakota': 'SD',
    Tennessee: 'TN',
    Texas: 'TX',
    Utah: 'UT',
    Vermont: 'VT',
    Virginia: 'VA',
    Washington: 'WA',
    'West Virginia': 'WV',
    Wisconsin: 'WI',
    Wyoming: 'WY'
  }
  return map[name] || ''
}

const usGridLayout = [
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  'ME',
  'AK',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  'VT',
  'NH',
  '',
  'WA',
  'ID',
  'MT',
  'ND',
  'MN',
  'IL',
  'WI',
  'MI',
  '',
  'NY',
  'MA',
  'RI',
  '',
  'OR',
  'NV',
  'WY',
  'SD',
  'IA',
  'IN',
  'OH',
  'PA',
  'NJ',
  'CT',
  '',
  '',
  'CA',
  'UT',
  'CO',
  'NE',
  'MO',
  'KY',
  'WV',
  'VA',
  'MD',
  'DE',
  '',
  '',
  '',
  'AZ',
  'NM',
  'KS',
  'AR',
  'TN',
  'NC',
  'SC',
  'DC',
  '',
  '',
  'HI',
  '',
  '',
  '',
  'OK',
  'LA',
  'MS',
  'AL',
  'GA',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  'TX',
  '',
  '',
  '',
  'FL',
  '',
  '',
  ''
]

onMounted(async () => {
  congressStore.loaded = false
  await congressStore.fetchMembers()
})

useHead({
  title: 'Congressional Database - nUSA',
  meta: [
    {
      name: 'description',
      content: 'Full record of nUSA Congress members, seat distribution, and state representation.'
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

/* Navbar (shared with index) */
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
.db-page {
  max-width: 900px;
  margin: 0 auto;
  padding: 2.5rem 1.5rem;
}
.db-header {
  margin-bottom: 2rem;
}
.db-title {
  font-size: 1.8rem;
  font-weight: 800;
  color: #1e3a5f;
  margin-bottom: 0.35rem;
}
.db-subtitle {
  font-size: 0.9rem;
  color: #6b7280;
}

/* Panel */
.db-panel {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}
.db-panel-title {
  font-size: 1rem;
  font-weight: 700;
  color: #1e3a5f;
  margin-bottom: 0.25rem;
}
.db-panel-sub {
  font-size: 0.8rem;
  color: #6b7280;
  margin-bottom: 1.25rem;
}

/* Donut Charts */
.db-charts {
  display: flex;
  justify-content: center;
  gap: 3rem;
  flex-wrap: wrap;
  margin-bottom: 1.25rem;
}
.db-chart-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.35rem;
}
.db-chart-label {
  font-size: 0.82rem;
  color: #6b7280;
  font-weight: 600;
}
.db-chart-num {
  font-size: 1.6rem;
  font-weight: 800;
  color: #1e3a5f;
}
.donut {
  width: 100px;
  height: 100px;
  transform: rotate(-90deg);
}
.donut-bg {
  fill: none;
  stroke: #e5e7eb;
  stroke-width: 18;
}
.donut-seg {
  fill: none;
  stroke-width: 18;
  stroke-linecap: butt;
  transition: stroke-dasharray 0.4s;
}
.donut-seg.forward {
  stroke: #3b82f6;
}
.donut-seg.pioneer {
  stroke: #ef4444;
}

.db-legend {
  display: flex;
  gap: 1.5rem;
  justify-content: center;
}
.db-legend-item {
  font-size: 0.82rem;
  font-weight: 600;
}
.db-legend-item.forward {
  color: #3b82f6;
}
.db-legend-item.pioneer {
  color: #ef4444;
}

/* State Grid */
.state-grid {
  display: grid;
  grid-template-columns: repeat(11, 1fr);
  gap: 3px;
  margin-bottom: 0.75rem;
}
.state-cell {
  aspect-ratio: 1;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 0.55rem;
  font-weight: 700;
  cursor: default;
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  transition: transform 0.1s;
  gap: 1px;
}
.state-cell:not(.empty) {
  cursor: pointer;
}
.state-cell:not(.empty):hover {
  transform: scale(1.1);
  z-index: 10;
}
.state-cell.empty {
  background: transparent;
  border-color: transparent;
  cursor: default;
}
.state-cell.forward {
  background: #dbeafe;
  border-color: #93c5fd;
  color: #1e40af;
}
.state-cell.pioneer {
  background: #fee2e2;
  border-color: #fca5a5;
  color: #991b1b;
}
.state-cell.independent {
  background: #f5f3ff;
  border-color: #c4b5fd;
  color: #5b21b6;
}
.state-cell.none {
  background: #f3f4f6;
  border-color: #e5e7eb;
  color: #9ca3af;
}
.state-cell.active {
  outline: 2px solid #1e3a5f;
  outline-offset: 1px;
}
.state-abbr {
  line-height: 1;
}
.state-count {
  font-size: 0.5rem;
  background: rgba(0, 0, 0, 0.12);
  border-radius: 3px;
  padding: 0 2px;
}
.state-legend {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  font-size: 0.75rem;
}
.state-leg {
  font-weight: 600;
}
.state-leg.forward {
  color: #3b82f6;
}
.state-leg.pioneer {
  color: #ef4444;
}
.state-leg.independent {
  color: #7c3aed;
}
.state-leg.none {
  color: #9ca3af;
}

/* Search */
.db-search-bar {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}
.db-search-input-wrap {
  flex: 1;
  min-width: 220px;
  position: relative;
}
.db-search-icon {
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.85rem;
}
.db-search-input {
  width: 100%;
  padding: 0.55rem 0.75rem 0.55rem 2.25rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  color: #374151;
  background: #ffffff;
  outline: none;
  box-sizing: border-box;
}
.db-search-input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.15);
}
.db-filter {
  padding: 0.55rem 0.85rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 0.82rem;
  color: #374151;
  background: #ffffff;
  cursor: pointer;
  outline: none;
}
.db-filter:focus {
  border-color: #3b82f6;
}

/* Member Sections */
.db-section {
  margin-bottom: 2.5rem;
}
.db-section-title {
  font-size: 1.15rem;
  font-weight: 700;
  color: #1e3a5f;
  margin-bottom: 1rem;
  border-bottom: 2px solid #e5e7eb;
  padding-bottom: 0.5rem;
}
.db-member-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1rem;
}
.db-member-card {
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
.db-member-card:hover {
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}
.db-member-avatar {
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
.db-member-info {
  flex: 1;
}
.db-member-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.15rem;
}
.db-member-name {
  font-size: 0.9rem;
  font-weight: 700;
  color: #1f2937;
}
.db-member-title {
  font-size: 0.78rem;
  color: #374151;
  margin-bottom: 0.1rem;
}
.db-member-user {
  font-size: 0.72rem;
  color: #9ca3af;
  margin-bottom: 0.5rem;
}
.db-member-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem;
}
.db-status {
  font-size: 0.65rem;
  font-weight: 700;
  padding: 0.15rem 0.5rem;
  border-radius: 9999px;
  flex-shrink: 0;
}
.db-status.active {
  background: #d1fae5;
  color: #065f46;
}
.db-status.former {
  background: #f3f4f6;
  color: #6b7280;
  border: 1px solid #d1d5db;
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

.db-empty {
  color: #9ca3af;
  font-size: 0.875rem;
  padding: 1rem 0;
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
  .db-charts {
    gap: 1.5rem;
  }
  .state-grid {
    grid-template-columns: repeat(8, 1fr);
  }
  .db-search-bar {
    flex-direction: column;
  }
  .db-search-input-wrap {
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
[data-theme='dark'] .db-page {
  background: #111827;
}
[data-theme='dark'] .db-header {
  background: #1f2937;
  border-color: #374151;
}
[data-theme='dark'] .db-title {
  color: #f3f4f6;
}
[data-theme='dark'] .db-subtitle {
  color: #9ca3af;
}
[data-theme='dark'] .db-panel {
  background: #1f2937;
  border-color: #374151;
}
[data-theme='dark'] .db-panel-title {
  color: #f3f4f6;
}
[data-theme='dark'] .db-chart-label {
  color: #9ca3af;
}
[data-theme='dark'] .db-chart-num {
  color: #f3f4f6;
}
[data-theme='dark'] .db-search-bar {
  background: #1f2937;
  border-color: #374151;
}
[data-theme='dark'] .db-search-input {
  background: #111827;
  color: #f3f4f6;
  border-color: #374151;
}
[data-theme='dark'] .db-search-input::placeholder {
  color: #6b7280;
}
[data-theme='dark'] .db-filter {
  background: #111827;
  color: #f3f4f6;
  border-color: #374151;
}
[data-theme='dark'] .db-section-title {
  color: #f3f4f6;
}
[data-theme='dark'] .db-member-card {
  background: #1f2937;
  border-color: #374151;
}
[data-theme='dark'] .db-member-name {
  color: #f3f4f6;
}
[data-theme='dark'] .db-member-title,
[data-theme='dark'] .db-member-user {
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
