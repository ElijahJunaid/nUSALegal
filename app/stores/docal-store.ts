import { defineStore } from 'pinia'
import { useApiToken } from '~/composables/useApiToken'

export interface Business {
  name: string
  owner: string
  type: string
  state: string
  status: string
  description: string
}

export const useDocalStore = defineStore('docal', {
  state: () => ({
    businesses: [] as Business[],
    loaded: false,
    loading: false,
    error: null as string | null
  }),

  actions: {
    async fetchBusinesses() {
      if (this.loaded) return

      this.loading = true
      this.error = null

      try {
        const { getToken } = useApiToken()
        const token = await getToken('docal/businesses')

        const data = await $fetch<Business[]>('/api/docal/businesses', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        this.businesses = data
        this.loaded = true
      } catch (err: unknown) {
        const e = err as { data?: { statusMessage?: string }; message?: string }
        this.error = e?.data?.statusMessage || e?.message || 'Failed to fetch businesses'
        console.error('Failed to fetch DOCAL businesses:', err)
      } finally {
        this.loading = false
      }
    }
  }
})
