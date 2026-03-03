<template>
  <div class="relative w-full max-w-md">
    <div class="relative">
      <input 
        v-model="searchQuery"
        @input="handleSearch"
        @focus="showResults = true"
        type="text"
        placeholder="Search bills, laws, definitions..."
        class="input input-bordered w-full pl-10 pr-10"
      />
      <Icon name="lucide:search" class="w-5 h-5 absolute left-3 top-3 text-gray-400" />
      
      <button 
        v-if="searchQuery"
        @click="clearSearch"
        class="btn btn-ghost btn-xs btn-circle absolute right-2 top-2"
      >
        <Icon name="lucide:x" class="w-4 h-4" />
      </button>
    </div>

    <div v-if="isLoading" class="absolute top-full left-0 right-0 mt-2 bg-base-100 shadow-xl rounded-lg p-4 z-50">
      <div class="flex items-center justify-center gap-2">
        <Icon name="lucide:loader-2" class="w-5 h-5 animate-spin" />
        <span>Searching...</span>
      </div>
    </div>

    <div 
      v-else-if="showResults && results.length > 0" 
      class="absolute top-full left-0 right-0 mt-2 bg-base-100 shadow-xl rounded-lg max-h-96 overflow-y-auto z-50 border border-base-300"
    >
      <div 
        v-for="result in results" 
        :key="result.id || result.title" 
        class="p-3 hover:bg-base-200 cursor-pointer border-b border-base-200 last:border-b-0"
        @click="selectResult(result)"
      >
        <div class="flex items-center gap-2">
          <span class="badge badge-sm" :class="getBadgeClass(result.type)">
            {{ result.type }}
          </span>
          <span class="font-medium text-sm">{{ result.title }}</span>
        </div>
        <p class="text-xs text-gray-600 mt-1 line-clamp-2">
          {{ truncate(result.description || result.content, 120) }}
        </p>
      </div>
    </div>

    <div 
      v-else-if="showResults && searchQuery.length >= 2 && results.length === 0 && !isLoading"
      class="absolute top-full left-0 right-0 mt-2 bg-base-100 shadow-xl rounded-lg p-4 z-50 border border-base-300"
    >
      <div class="text-center text-gray-500">
        <Icon name="lucide:search-x" class="w-8 h-8 mx-auto mb-2" />
        <p>No results found for "{{ searchQuery }}"</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

interface SearchResult {
  id?: string
  title: string
  subtitle?: string
  content: string
  description?: string
  type: string
  url?: string
}

interface SearchResponse {
  results: SearchResult[]
  total: number
}

const searchQuery = ref('')
const results = ref<SearchResult[]>([])
const showResults = ref(false)
const isLoading = ref(false)
let searchTimeout: NodeJS.Timeout | null = null

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})

const handleClickOutside = (e: MouseEvent) => {
  const target = e.target as HTMLElement
  if (!target.closest('.relative')) {
    showResults.value = false
  }
}

const handleSearch = async () => {
  clearTimeout(searchTimeout!)
  
  if (searchQuery.value.length < 2) {
    results.value = []
    return
  }
  
  isLoading.value = true
  searchTimeout = setTimeout(async () => {
    try {
      const response = await $fetch<SearchResponse>('/api/search', {
        params: { q: searchQuery.value }
      })
      results.value = response.results
    } catch (error) {
      console.error('Search error:', error)
      results.value = []
    } finally {
      isLoading.value = false
    }
  }, 300)
}

const clearSearch = () => {
  searchQuery.value = ''
  results.value = []
  showResults.value = false
}

const selectResult = (result: any) => {
  
  showResults.value = false
  
  console.log('Selected:', result)
}

const getBadgeClass = (type: string) => {
  const classes: Record<string, string> = {
    'bill': 'badge-primary',
    'law': 'badge-secondary',
    'definition': 'badge-accent',
    'executive-order': 'badge-warning'
  }
  return classes[type] || 'badge-ghost'
}

const truncate = (text: string, length: number) => {
  if (!text) return ''
  return text.length > length ? text.substring(0, length) + '...' : text
}
</script>