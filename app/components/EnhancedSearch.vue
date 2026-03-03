<template>
  <div class="enhanced-search">
    <div class="search-hero">
      <h2 class="text-3xl font-bold text-center mb-4">Search nUSA Legal</h2>
      <p class="text-center mb-6 opacity-80">Search across laws, court cases, rules, and resources</p>
      
      <div class="search-input-wrapper">
        <div class="search-input-container">
          <svg class="search-icon" viewBox="0 0 24 24" width="24" height="24">
            <path fill="currentColor" d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z"/>
          </svg>
          <input 
            v-model="searchQuery"
            type="text"
            placeholder="Search for laws, cases, rules, or topics..."
            class="search-input"
            @input="onSearchInput"
            @focus="showResults = true"
          />
          <button 
            v-if="searchQuery" 
            @click="clearSearch"
            class="clear-button"
          >
            ✕
          </button>
        </div>

        <button 
          @click="showFilters = !showFilters"
          class="filter-toggle"
        >
          <svg viewBox="0 0 24 24" width="20" height="20">
            <path fill="currentColor" d="M14,12V19.88C14.04,20.18 13.94,20.5 13.71,20.71C13.32,21.1 12.69,21.1 12.3,20.71L10.29,18.7C10.06,18.47 9.96,18.16 10,17.87V12H9.97L4.21,4.62C3.87,4.19 3.95,3.56 4.38,3.22C4.57,3.08 4.78,3 5,3V3H19V3C19.22,3 19.43,3.08 19.62,3.22C20.05,3.56 20.13,4.19 19.79,4.62L14.03,12H14Z"/>
          </svg>
          Filters
        </button>
      </div>

      <div v-if="showFilters" class="filters-panel">
        <div class="filter-group">
          <label class="filter-label">Category:</label>
          <select v-model="selectedCategory" class="filter-select" @change="performSearch">
            <option value="all">All Categories</option>
            <option value="laws">Laws (Federal & Municipal)</option>
            <option value="constitution">Constitution</option>
            <option value="bills">Executive Orders</option>
            <option value="rules">Federal Rules (FRCP/FRCMP)</option>
            <option value="courts">Court Cases</option>
            <option value="resources">Resources & Definitions</option>
          </select>
        </div>
      </div>
    </div>

    <div v-if="showResults && (searchResults.length > 0 || isSearching)" class="results-dropdown">
      <div v-if="isSearching" class="loading-state">
        <div class="spinner"></div>
        <span>Searching...</span>
      </div>

      <div v-else-if="searchResults.length === 0 && searchQuery" class="no-results">
        <p>No results found for "{{ searchQuery }}"</p>
        <p class="text-sm opacity-70 mt-2">Try different keywords or check your spelling</p>
      </div>

      <div v-else class="results-list">
        <div 
          v-for="(result, index) in searchResults" 
          :key="index"
          @click="navigateToResult(result)"
          class="result-item"
        >
          <div class="result-header">
            <span class="result-title">{{ result.title }}</span>
            <span 
              class="result-badge"
              :style="{ backgroundColor: result.categoryColor }"
            >
              {{ result.category }}
            </span>
          </div>
          <div v-if="result.subtitle" class="result-subtitle">{{ result.subtitle }}</div>
          <div v-if="result.excerpt" class="result-excerpt" v-html="result.excerpt"></div>
        </div>
      </div>

      <div v-if="searchResults.length > 0" class="results-footer">
        Showing {{ searchResults.length }} result{{ searchResults.length !== 1 ? 's' : '' }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const searchQuery = ref('')
const selectedCategory = ref('all')
const searchResults = ref<any[]>([])
const isSearching = ref(false)
const showResults = ref(false)
const showFilters = ref(false)

let searchTimeout: NodeJS.Timeout | null = null

const onSearchInput = () => {
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }

  if (searchQuery.value.trim().length < 2) {
    searchResults.value = []
    return
  }

  searchTimeout = setTimeout(() => {
    performSearch()
  }, 300)
}

const performSearch = async () => {
  if (!searchQuery.value.trim() || searchQuery.value.trim().length < 2) {
    searchResults.value = []
    return
  }

  isSearching.value = true
  
  try {
    const results = await $fetch('/api/global-search', {
      params: {
        q: searchQuery.value,
        category: selectedCategory.value
      }
    })
    
    searchResults.value = results as any[]
    showResults.value = true
  } catch (error) {
    console.error('Search error:', error)
    searchResults.value = []
  } finally {
    isSearching.value = false
  }
}

const clearSearch = () => {
  searchQuery.value = ''
  searchResults.value = []
  showResults.value = false
}

const navigateToResult = (result: any) => {
  router.push(result.url)
  clearSearch()
}

if (process.client) {
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement
    if (!target.closest('.enhanced-search')) {
      showResults.value = false
    }
  })
}
</script>

<style scoped>
.enhanced-search {
  position: relative;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
}

.search-hero {
  margin-bottom: 1rem;
}

.search-input-wrapper {
  display: flex;
  gap: 0.75rem;
  align-items: center;
}

.search-input-container {
  flex: 1;
  position: relative;
  display: flex;
  align-items: center;
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 0.75rem;
  padding: 0 1rem;
  transition: all 0.3s ease;
}

.search-input-container:focus-within {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

[data-theme='dark'] .search-input-container {
  background: #2d2d2d;
  border-color: #4a4a4a;
}

.search-icon {
  color: #9ca3af;
  margin-right: 0.75rem;
}

.search-input {
  flex: 1;
  border: none;
  outline: none;
  padding: 1rem 0;
  font-size: 1rem;
  background: transparent;
  color: inherit;
}

.clear-button {
  background: none;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  padding: 0.5rem;
  font-size: 1.25rem;
  transition: color 0.2s;
}

.clear-button:hover {
  color: #ef4444;
}

.filter-toggle {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 1.5rem;
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 0.75rem;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
}

.filter-toggle:hover {
  border-color: #667eea;
}

[data-theme='dark'] .filter-toggle {
  background: #2d2d2d;
  border-color: #4a4a4a;
}

.filters-panel {
  margin-top: 1rem;
  padding: 1.5rem;
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 0.75rem;
}

[data-theme='dark'] .filters-panel {
  background: #2d2d2d;
  border-color: #4a4a4a;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.filter-label {
  font-weight: 600;
}

.filter-select {
  flex: 1;
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  background: white;
  cursor: pointer;
}

[data-theme='dark'] .filter-select {
  background: #1a1a1a;
  border-color: #4a4a4a;
  color: #e2e8f0;
}

.results-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 0.5rem;
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 0.75rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  max-height: 500px;
  overflow-y: auto;
  z-index: 50;
}

[data-theme='dark'] .results-dropdown {
  background: #2d2d2d;
  border-color: #4a4a4a;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
}

.loading-state {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 2rem;
  color: #64748b;
}

.spinner {
  border: 3px solid #e5e7eb;
  border-top: 3px solid #667eea;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.no-results {
  padding: 2rem;
  text-align: center;
  color: #64748b;
}

.results-list {
  padding: 0.5rem;
}

.result-item {
  padding: 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background 0.2s;
}

.result-item:hover {
  background: #f3f4f6;
}

[data-theme='dark'] .result-item:hover {
  background: #3a3a3a;
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.result-title {
  font-weight: 600;
  font-size: 1rem;
  flex: 1;
}

.result-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  color: white;
}

.result-subtitle {
  font-size: 0.875rem;
  color: #64748b;
  margin-bottom: 0.5rem;
}

.result-excerpt {
  font-size: 0.875rem;
  color: #6b7280;
  line-height: 1.4;
}

.results-footer {
  padding: 0.75rem 1rem;
  border-top: 1px solid #e5e7eb;
  font-size: 0.875rem;
  color: #64748b;
  text-align: center;
}

[data-theme='dark'] .results-footer {
  border-top-color: #4a4a4a;
}
</style>