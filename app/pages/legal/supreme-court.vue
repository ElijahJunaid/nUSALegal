<template>
  <div class="sc-wrapper">
    <div class="sc-header">
      <div class="sc-header-content">
        <h1 class="sc-title">⚖️ Supreme Court Rulings</h1>
        <p class="sc-subtitle">
          Browse and access official Supreme Court rulings and decisions from the nUSA judicial
          system.
        </p>
      </div>
    </div>

    <div class="sc-filters">
      <div class="sc-filter-row">
        <div class="sc-search">
          <span class="sc-search-icon">🔍</span>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search rulings by title, docket number, or keywords..."
            class="sc-search-input"
            @input="handleSearch"
          />
        </div>

        <select v-model="selectedCategory" class="sc-filter-select" @change="handleCategoryChange">
          <option value="">All Categories</option>
          <option
            v-for="category in supremeCourtStore.categories"
            :key="category"
            :value="category"
          >
            {{ category }}
          </option>
        </select>

        <div class="sc-date-filters">
          <input v-model="dateFrom" type="date" class="sc-date-input" @change="handleDateFilter" />
          <span class="sc-date-separator">to</span>
          <input v-model="dateTo" type="date" class="sc-date-input" @change="handleDateFilter" />
        </div>

        <button
          v-if="supremeCourtStore.hasActiveFilters"
          @click="clearFilters"
          class="sc-clear-filters"
        >
          Clear Filters
        </button>
      </div>
    </div>

    <div class="sc-content">
      <div v-if="supremeCourtStore.isLoading" class="sc-loading">
        <div class="sc-loading-spinner"></div>
        <p>Loading Supreme Court rulings...</p>
      </div>

      <div v-else-if="supremeCourtStore.hasRulings" class="sc-rulings">
        <div class="sc-results-header">
          <p class="sc-results-count">
            {{ supremeCourtStore.totalItems }} ruling{{
              supremeCourtStore.totalItems !== 1 ? 's' : ''
            }}
            found
          </p>
        </div>

        <div class="sc-rulings-grid">
          <div
            v-for="ruling in supremeCourtStore.filteredRulings"
            :key="ruling.id"
            class="sc-ruling-card"
            @click="selectRuling(ruling)"
          >
            <div class="sc-ruling-header">
              <h3 class="sc-ruling-title">{{ ruling.title }}</h3>
              <span class="sc-ruling-decision" :class="getDecisionClass(ruling.decision)">
                {{ ruling.decision }}
              </span>
            </div>

            <div class="sc-ruling-meta">
              <p class="sc-ruling-docket">Docket: {{ ruling.docketNumber }}</p>
              <p class="sc-ruling-citation">{{ ruling.citation }}</p>
              <p class="sc-ruling-date">{{ formatDate(ruling.date) }}</p>
            </div>

            <div class="sc-ruling-category">
              <span class="sc-category-badge">{{ ruling.category }}</span>
            </div>

            <div class="sc-ruling-justices">
              <p class="sc-justices-label">Justices:</p>
              <div class="sc-justices-list">
                <span v-for="justice in ruling.justices" :key="justice" class="sc-justice-name">
                  {{ justice }}
                </span>
              </div>
            </div>

            <div class="sc-ruling-actions">
              <button @click.stop="downloadRuling(ruling.id)" class="sc-download-btn">
                📄 Download PDF
              </button>
              <button @click.stop="viewRuling(ruling)" class="sc-view-btn">👁️ View Details</button>
            </div>
          </div>
        </div>

        <div v-if="supremeCourtStore.totalPages > 1" class="sc-pagination">
          <button
            @click="goToPage(supremeCourtStore.currentPage - 1)"
            :disabled="supremeCourtStore.currentPage === 1"
            class="sc-page-btn"
          >
            ← Previous
          </button>

          <span class="sc-page-info">
            Page {{ supremeCourtStore.currentPage }} of {{ supremeCourtStore.totalPages }}
          </span>

          <button
            @click="goToPage(supremeCourtStore.currentPage + 1)"
            :disabled="supremeCourtStore.currentPage === supremeCourtStore.totalPages"
            class="sc-page-btn"
          >
            Next →
          </button>
        </div>
      </div>

      <div v-else class="sc-empty">
        <div class="sc-empty-icon">⚖️</div>
        <h3 class="sc-empty-title">No rulings found</h3>
        <p class="sc-empty-subtitle">
          {{
            supremeCourtStore.hasActiveFilters
              ? 'Try adjusting your search filters.'
              : 'No Supreme Court rulings are available at this time.'
          }}
        </p>
        <button
          v-if="supremeCourtStore.hasActiveFilters"
          @click="clearFilters"
          class="sc-clear-btn"
        >
          Clear Filters
        </button>
      </div>
    </div>

    <!-- Ruling Detail Modal -->
    <div v-if="selectedRuling" class="sc-modal-overlay" @click="closeModal">
      <div class="sc-modal" @click.stop>
        <div class="sc-modal-header">
          <h2 class="sc-modal-title">{{ selectedRuling.title }}</h2>
          <button @click="closeModal" class="sc-modal-close">×</button>
        </div>

        <div class="sc-modal-content">
          <div class="sc-modal-meta">
            <div class="sc-meta-item">
              <strong>Docket Number:</strong>
              {{ selectedRuling.docketNumber }}
            </div>
            <div class="sc-meta-item">
              <strong>Citation:</strong>
              {{ selectedRuling.citation }}
            </div>
            <div class="sc-meta-item">
              <strong>Date:</strong>
              {{ formatDate(selectedRuling.date) }}
            </div>
            <div class="sc-meta-item">
              <strong>Category:</strong>
              {{ selectedRuling.category }}
            </div>
            <div class="sc-meta-item">
              <strong>Decision:</strong>
              <span class="sc-decision" :class="getDecisionClass(selectedRuling.decision)">
                {{ selectedRuling.decision }}
              </span>
            </div>
          </div>

          <div class="sc-modal-summary">
            <h3>Summary</h3>
            <p>{{ selectedRuling.summary }}</p>
          </div>

          <div class="sc-modal-justices">
            <h3>Justices</h3>
            <div class="sc-justices-grid">
              <span
                v-for="justice in selectedRuling.justices"
                :key="justice"
                class="sc-justice-badge"
              >
                {{ justice }}
              </span>
            </div>
          </div>
        </div>

        <div class="sc-modal-actions">
          <button @click="downloadRuling(selectedRuling.id)" class="sc-download-btn">
            📄 Download PDF
          </button>
          <button @click="closeModal" class="sc-close-btn">Close</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useSupremeCourtStore, type SupremeCourtRuling } from '~/stores/supreme-court-store'

const supremeCourtStore = useSupremeCourtStore()

const searchQuery = ref('')
const selectedCategory = ref('')
const dateFrom = ref('')
const dateTo = ref('')
const selectedRuling = ref<SupremeCourtRuling | null>(null)

onMounted(() => {
  supremeCourtStore.fetchRulings()
})

// Simple debounce function
const debounce = (func: Function, wait: number) => {
  let timeout: NodeJS.Timeout
  return function executedFunction(...args: unknown[]) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

const handleSearch = debounce(() => {
  supremeCourtStore.searchRulings(searchQuery.value)
}, 500)

const handleCategoryChange = () => {
  supremeCourtStore.filterByCategory(selectedCategory.value)
}

const handleDateFilter = () => {
  supremeCourtStore.filterByDateRange(dateFrom.value, dateTo.value)
}

const clearFilters = () => {
  searchQuery.value = ''
  selectedCategory.value = ''
  dateFrom.value = ''
  dateTo.value = ''
  supremeCourtStore.clearFilters()
}

const goToPage = (page: number) => {
  supremeCourtStore.goToPage(page)
}

const selectRuling = (ruling: SupremeCourtRuling) => {
  selectedRuling.value = ruling
}

const closeModal = () => {
  selectedRuling.value = null
}

const viewRuling = (ruling: SupremeCourtRuling) => {
  selectedRuling.value = ruling
}

const downloadRuling = async (rulingId: string) => {
  await supremeCourtStore.downloadRuling(rulingId)
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const getDecisionClass = (decision: string) => {
  switch (decision.toLowerCase()) {
    case 'unanimous':
      return 'decision-unanimous'
    case 'affirmed':
      return 'decision-affirmed'
    case 'reversed':
      return 'decision-reversed'
    default:
      return 'decision-split'
  }
}
</script>

<style scoped>
.sc-wrapper {
  min-height: 100vh;
  background: var(--color-bg);
  padding: 2rem 1rem;
}

.sc-header {
  text-align: center;
  margin-bottom: 3rem;
}

.sc-header-content {
  max-width: 800px;
  margin: 0 auto;
}

.sc-title {
  font-size: 2.5rem;
  font-weight: 800;
  color: var(--color-text);
  margin-bottom: 1rem;
}

.sc-subtitle {
  font-size: 1.1rem;
  color: var(--color-text-secondary);
  line-height: 1.6;
}

.sc-filters {
  max-width: 1200px;
  margin: 0 auto 2rem;
  padding: 1.5rem;
  background: var(--color-bg-card);
  border-radius: 0.75rem;
  border: 1px solid var(--color-border);
}

.sc-filter-row {
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
}

.sc-search {
  flex: 1;
  min-width: 300px;
  position: relative;
}

.sc-search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-text-secondary);
}

.sc-search-input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 1px solid var(--color-border);
  border-radius: 0.5rem;
  font-size: 0.9rem;
  background: var(--color-bg);
  color: var(--color-text);
}

.sc-filter-select {
  padding: 0.75rem 1rem;
  border: 1px solid var(--color-border);
  border-radius: 0.5rem;
  font-size: 0.9rem;
  background: var(--color-bg);
  color: var(--color-text);
  min-width: 150px;
}

.sc-date-filters {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.sc-date-input {
  padding: 0.75rem 1rem;
  border: 1px solid var(--color-border);
  border-radius: 0.5rem;
  font-size: 0.9rem;
  background: var(--color-bg);
  color: var(--color-text);
}

.sc-date-separator {
  color: var(--color-text-secondary);
  font-size: 0.9rem;
}

.sc-clear-filters {
  padding: 0.75rem 1rem;
  background: var(--color-danger);
  color: var(--color-text-inverse);
  border: none;
  border-radius: 0.5rem;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.sc-clear-filters:hover {
  background: var(--color-danger-hover);
}

.sc-content {
  max-width: 1200px;
  margin: 0 auto;
}

.sc-loading {
  text-align: center;
  padding: 4rem 1rem;
}

.sc-loading-spinner {
  width: 3rem;
  height: 3rem;
  border: 3px solid var(--color-border);
  border-top: 3px solid var(--color-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.sc-rulings-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.sc-ruling-card {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 0.75rem;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.sc-ruling-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--color-shadow-hover);
}

.sc-ruling-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.sc-ruling-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--color-text);
  line-height: 1.3;
  margin: 0;
  flex: 1;
}

.sc-ruling-decision {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  flex-shrink: 0;
}

.decision-unanimous {
  background: var(--color-success-bg);
  color: var(--color-success-text);
}

.decision-affirmed {
  background: var(--color-info-bg);
  color: var(--color-info-text);
}

.decision-reversed {
  background: var(--color-danger-bg);
  color: var(--color-danger-text);
}

.decision-split {
  background: var(--color-warning-bg);
  color: var(--color-warning-text);
}

.sc-ruling-meta {
  margin-bottom: 1rem;
}

.sc-ruling-docket,
.sc-ruling-citation,
.sc-ruling-date {
  font-size: 0.85rem;
  color: var(--color-text-secondary);
  margin: 0.25rem 0;
}

.sc-ruling-category {
  margin-bottom: 1rem;
}

.sc-category-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background: var(--color-accent);
  color: var(--color-text-inverse);
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
}

.sc-ruling-justices {
  margin-bottom: 1rem;
}

.sc-justices-label {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--color-text);
  margin: 0 0 0.5rem 0;
}

.sc-justices-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.sc-justice-name {
  padding: 0.25rem 0.5rem;
  background: var(--color-bg-secondary);
  color: var(--color-text);
  border-radius: 0.25rem;
  font-size: 0.75rem;
}

.sc-ruling-actions {
  display: flex;
  gap: 0.75rem;
}

.sc-download-btn,
.sc-view-btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.5rem;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.sc-download-btn {
  background: var(--color-primary);
  color: var(--color-text-inverse);
}

.sc-download-btn:hover {
  background: var(--color-primary-hover);
}

.sc-view-btn {
  background: var(--color-bg-secondary);
  color: var(--color-text);
  border: 1px solid var(--color-border);
}

.sc-view-btn:hover {
  background: var(--color-bg-tertiary);
}

.sc-pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
}

.sc-page-btn {
  padding: 0.75rem 1.5rem;
  background: var(--color-primary);
  color: var(--color-text-inverse);
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease;
}

.sc-page-btn:disabled {
  background: var(--color-bg-secondary);
  color: var(--color-text-secondary);
  cursor: not-allowed;
}

.sc-page-btn:not(:disabled):hover {
  background: var(--color-primary-hover);
}

.sc-page-info {
  color: var(--color-text-secondary);
  font-weight: 500;
}

.sc-empty {
  text-align: center;
  padding: 4rem 1rem;
}

.sc-empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.sc-empty-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: 0.5rem;
}

.sc-empty-subtitle {
  color: var(--color-text-secondary);
  margin-bottom: 2rem;
}

.sc-clear-btn {
  padding: 0.75rem 1.5rem;
  background: var(--color-primary);
  color: var(--color-text-inverse);
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
}

/* Modal Styles */
.sc-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.sc-modal {
  background: var(--color-bg-card);
  border-radius: 1rem;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
}

.sc-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid var(--color-border);
}

.sc-modal-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-text);
  margin: 0;
}

.sc-modal-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: var(--color-text-secondary);
  cursor: pointer;
  padding: 0.25rem;
}

.sc-modal-content {
  padding: 1.5rem;
}

.sc-modal-meta {
  margin-bottom: 1.5rem;
}

.sc-meta-item {
  margin-bottom: 0.75rem;
  color: var(--color-text);
}

.sc-modal-summary {
  margin-bottom: 1.5rem;
}

.sc-modal-summary h3 {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: 0.75rem;
}

.sc-modal-justices h3 {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: 0.75rem;
}

.sc-justices-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.sc-justice-badge {
  padding: 0.5rem 1rem;
  background: var(--color-accent);
  color: var(--color-text-inverse);
  border-radius: 9999px;
  font-size: 0.85rem;
  font-weight: 600;
}

.sc-modal-actions {
  display: flex;
  gap: 1rem;
  padding: 1.5rem;
  border-top: 1px solid var(--color-border);
}

.sc-close-btn {
  padding: 0.75rem 1.5rem;
  background: var(--color-bg-secondary);
  color: var(--color-text);
  border: 1px solid var(--color-border);
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
}

@media (max-width: 768px) {
  .sc-filter-row {
    flex-direction: column;
    align-items: stretch;
  }

  .sc-search {
    min-width: auto;
  }

  .sc-date-filters {
    justify-content: center;
  }

  .sc-rulings-grid {
    grid-template-columns: 1fr;
  }

  .sc-ruling-actions {
    flex-direction: column;
  }

  .sc-modal {
    margin: 1rem;
  }
}
</style>
