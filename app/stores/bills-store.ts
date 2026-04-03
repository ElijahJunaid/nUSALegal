import { defineStore } from 'pinia'
import { useApiToken } from '~/composables/useApiToken'
import { dError } from '~/plugins/debug-logger.client'

interface Bill {
  number: string
  description: string
  pdfPath: string
  type: 'hr' | 's' | 'hjres' | 'sjres' | 'hconres' | 'sconres' | 'hres' | 'sres'
  title?: string
  congress?: number
  publicLaw?: string
}

interface DCBill {
  id: string
  title: string
  description: string
  pdfPath: string
  type: 'act' | 'ordinance' | 'resolution'
  category: 'city-council'
  status: 'enacted' | 'pending' | 'vetoed' | 'withdrawn' | 'committee'
  introducedDate: string
  enactedDate?: string
  sponsor?: string
  billNumber?: string
  session?: string
}

export const useBillsStore = defineStore('bills', {
  state: () => ({
    selectedSection: 'congress' as 'congress' | 'city-council',
    searchQuery: '',
    filterType: 'all',
    filterStatus: 'all' as 'all' | 'enacted' | 'pending' | 'vetoed' | 'withdrawn' | 'committee',
    congressBills: [] as Bill[],
    dcBills: [] as DCBill[],
    congressLoaded: false,
    dcLoaded: false,
    loading: false,
    error: null as string | null
  }),

  getters: {
    filteredCongressBills: state => {
      let bills = state.congressBills

      if (state.filterType !== 'all') {
        bills = bills.filter(bill => bill.type === state.filterType)
      }
      if (state.searchQuery.trim()) {
        const query = state.searchQuery.toLowerCase()
        bills = bills.filter(
          bill =>
            bill.number.toLowerCase().includes(query) ||
            bill.description.toLowerCase().includes(query)
        )
      }

      return bills
    },
    filteredDCBills: state => {
      let bills = state.dcBills

      if (state.filterType !== 'all') {
        bills = bills.filter(bill => bill.type === state.filterType)
      }
      if (state.filterStatus !== 'all') {
        bills = bills.filter(bill => bill.status === state.filterStatus)
      }
      if (state.searchQuery.trim()) {
        const query = state.searchQuery.toLowerCase()
        bills = bills.filter(
          bill =>
            bill.title.toLowerCase().includes(query) ||
            bill.description.toLowerCase().includes(query) ||
            bill.billNumber?.toLowerCase().includes(query) ||
            bill.sponsor?.toLowerCase().includes(query)
        )
      }

      return bills
    }
  },

  actions: {
    async setSection(section: 'congress' | 'city-council') {
      this.selectedSection = section
      this.searchQuery = ''
      this.filterType = 'all'
      this.filterStatus = 'all'

      if (section === 'congress' && !this.congressLoaded) {
        await this.fetchCongressBills()
      } else if (section === 'city-council' && !this.dcLoaded) {
        await this.fetchDCBills()
      }
    },

    async fetchCongressBills() {
      if (this.congressLoaded) {
        return
      }

      this.loading = true
      this.error = null

      try {
        const { getToken } = useApiToken()
        const token = await getToken('bills/congress')

        const data = await $fetch<Bill[]>('/api/bills/congress', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        this.congressBills = data
        this.congressLoaded = true
      } catch (err: unknown) {
        const e = err as { data?: { statusMessage?: string }; message?: string }
        this.error = e?.data?.statusMessage || e?.message || 'Failed to fetch congress bills'
        dError('Failed to fetch congress bills:', err)
      } finally {
        this.loading = false
      }
    },

    async fetchDCBills() {
      if (this.dcLoaded) {
        return
      }

      this.loading = true
      this.error = null

      try {
        const tokenResponse = await $fetch<{ token: string; expiresIn: string }>(
          '/api/auth/token',
          {
            method: 'POST',
            body: { endpoint: 'bills/city-council' }
          }
        )
        const data = await $fetch<DCBill[]>('/api/bills/city-council', {
          headers: {
            Authorization: `Bearer ${tokenResponse.token}`
          }
        })

        this.dcBills = data
        this.dcLoaded = true
      } catch (err: unknown) {
        const e = err as { data?: { statusMessage?: string }; message?: string }
        this.error = e?.data?.statusMessage || e?.message || 'Failed to fetch DC bills'
        dError('Failed to fetch DC bills:', err)
      } finally {
        this.loading = false
      }
    }
  }
})
