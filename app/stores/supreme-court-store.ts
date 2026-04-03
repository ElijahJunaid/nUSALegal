import { defineStore } from 'pinia'

export interface SupremeCourtRuling {
  id: string
  title: string
  docketNumber: string
  category: string
  date: string
  summary: string
  pdfUrl: string
  justices: string[]
  decision: string
  citation: string
}

export interface SupremeCourtFilters {
  search: string
  category: string
  dateFrom: string
  dateTo: string
}

export interface SupremeCourtPagination {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
}

export const useSupremeCourtStore = defineStore('supreme-court', {
  state: () => ({
    rulings: [] as SupremeCourtRuling[],
    categories: [] as string[],
    loading: false,
    error: null as string | null,
    filters: {
      search: '',
      category: '',
      dateFrom: '',
      dateTo: ''
    } as SupremeCourtFilters,
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalItems: 0,
      itemsPerPage: 20
    } as SupremeCourtPagination,
    selectedRuling: null as SupremeCourtRuling | null
  }),

  actions: {
    async fetchRulings(page = 1) {
      this.loading = true
      this.error = null

      try {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: this.pagination.itemsPerPage.toString(),
          search: this.filters.search,
          category: this.filters.category,
          dateFrom: this.filters.dateFrom,
          dateTo: this.filters.dateTo
        })

        const response = (await $fetch(`/api/supreme-court/rulings?${params.toString()}`)) as {
          success: boolean
          data: {
            rulings: SupremeCourtRuling[]
            categories: string[]
            pagination: SupremeCourtPagination
          }
        }

        if (response.success) {
          this.rulings = response.data.rulings
          this.categories = response.data.categories
          this.pagination = response.data.pagination
          this.pagination.currentPage = page
        } else {
          throw new Error('Failed to fetch rulings')
        }
      } catch (error) {
        console.error('Error fetching Supreme Court rulings:', error)
        this.error = 'Failed to load Supreme Court rulings'
        throw error
      } finally {
        this.loading = false
      }
    },

    async searchRulings(searchTerm: string) {
      this.filters.search = searchTerm
      this.pagination.currentPage = 1
      await this.fetchRulings(1)
    },

    async filterByCategory(category: string) {
      this.filters.category = category
      this.pagination.currentPage = 1
      await this.fetchRulings(1)
    },

    async filterByDateRange(dateFrom: string, dateTo: string) {
      this.filters.dateFrom = dateFrom
      this.filters.dateTo = dateTo
      this.pagination.currentPage = 1
      await this.fetchRulings(1)
    },

    async clearFilters() {
      this.filters = {
        search: '',
        category: '',
        dateFrom: '',
        dateTo: ''
      }
      this.pagination.currentPage = 1
      await this.fetchRulings(1)
    },

    async goToPage(page: number) {
      if (page >= 1 && page <= this.pagination.totalPages) {
        await this.fetchRulings(page)
      }
    },

    selectRuling(ruling: SupremeCourtRuling) {
      this.selectedRuling = ruling
    },

    clearSelectedRuling() {
      this.selectedRuling = null
    },

    async downloadRuling(rulingId: string) {
      try {
        const response = (await $fetch(`/api/supreme-court/${rulingId}/pdf`, {
          method: 'GET'
        })) as ArrayBuffer

        // Create blob and download
        const blob = new globalThis.Blob([response], { type: 'application/pdf' })
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `supreme-court-ruling-${rulingId}.pdf`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)

        return true
      } catch (error) {
        console.error('Error downloading ruling:', error)
        this.error = 'Failed to download ruling'
        return false
      }
    }
  },

  getters: {
    filteredRulings: state => state.rulings,
    hasRulings: state => state.rulings.length > 0,
    totalPages: state => state.pagination.totalPages,
    currentPage: state => state.pagination.currentPage,
    totalItems: state => state.pagination.totalItems,
    isLoading: state => state.loading,
    errorMessage: state => state.error,
    activeFilters: state => ({
      search: state.filters.search,
      category: state.filters.category,
      dateFrom: state.filters.dateFrom,
      dateTo: state.filters.dateTo
    }),
    hasActiveFilters: state =>
      !!(
        state.filters.search ||
        state.filters.category ||
        state.filters.dateFrom ||
        state.filters.dateTo
      )
  }
})
