import { defineStore } from 'pinia'
import { useApiToken } from '~/composables/useApiToken'
import { dError } from '~/plugins/debug-logger.client'

export interface Business {
  name: string
  ownerUsername: string
  ownerDiscord: string
  representativeUsername: string
  representativeDiscord: string
  discord: string
  group: string
  sector: string
  ownership: string
  issuingAuthority: string
  issuingDate: string
  expirationDate: string
  status: 'Active' | 'Pending' | 'Expired' | 'Revoked' | 'Special'
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
        dError('Failed to fetch DOCAL businesses:', err)
      } finally {
        this.loading = false
      }
    }
  }
})
