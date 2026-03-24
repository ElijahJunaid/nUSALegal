import { defineStore } from 'pinia'
import { dError } from '~/plugins/debug-logger.client'

export const useCourtProcedureStore = defineStore('resource-court-procedure', {
  state: () => ({
    searchQuery: '',
    data: [] as string[],
    isLoaded: false,
    loading: false,
    error: null as string | null
  }),
  getters: {
    filteredData: state => {
      let data: string[] = state.data

      if (state.searchQuery.trim()) {
        const query = state.searchQuery.toLowerCase()
        data = data.filter(d => d.toLowerCase().includes(query))
      }

      return data
    }
  },
  actions: {
    async get() {
      this.searchQuery = ''

      if (!this.isLoaded) {
        await this.fetchData()
      }
    },

    async fetchData() {
      if (this.isLoaded) {
        return
      }

      this.loading = true
      this.error = null

      try {
        const tokenResponse = await $fetch<{ token: string; expiresIn: string }>(
          '/api/auth/token',
          {
            method: 'POST',
            body: { endpoint: 'resources/court-procedure' }
          }
        )
        const data = await $fetch<string[]>('/api/resources/court-procedure', {
          headers: {
            Authorization: `Bearer ${tokenResponse.token}`
          }
        })

        this.data = data
        this.isLoaded = true
      } catch (err: unknown) {
        const e = err as { data?: { statusMessage?: string }; message?: string }
        this.error = e?.data?.statusMessage || e?.message || 'Failed to fetch Court Procedure'
        dError('Failed to fetch Court Procedure:', err)
      } finally {
        this.loading = false
      }
    }
  }
})
