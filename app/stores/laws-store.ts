import { defineStore } from 'pinia'
import { dError } from '~/plugins/debug-logger.client'
import { useApiToken } from '~/composables/useApiToken'

interface MunicipalGroup {
  label: string
  data: Law[]
}

export interface Law {
  title: string
  subtitle: string
  content: string
  excerp: string
  category?: string
  section?: string
}

export const useLawsStore = defineStore('laws-rules', {
  state: () => ({
    selectedSection: 'federal' as 'federal' | 'eo' | 'municipal',
    searchQuery: '',
    filterType: 'all' as string | number,

    federal: [] as Law[],
    eo: [] as Law[],
    municipal: [] as MunicipalGroup[],
    federalLoaded: false,
    eoLoaded: false,
    municipalLoaded: false,
    loading: false,
    error: null as string | null
  }),

  getters: {
    filterFederalList(state): string[] {
      const categories = [...new Set(state.federal.map(law => law.category || 'Uncategorized'))]
      return categories.filter(c => c)
    },
    filterEOList(): string[] {
      return ['Administration EO', 'Law Enforcement EO', 'Organizational EO']
    },
    filterMunicipalList(state): string[] {
      const data: MunicipalGroup[] = state.municipal
      return data.map(d => d.label)
    },
    filteredFederal: state => {
      // Group federal laws by section for hierarchical organization
      const groupedLaws = state.federal.reduce(
        (acc, law) => {
          const section = law.section || 'General Provisions'
          if (!acc[section]) {
            acc[section] = []
          }
          acc[section].push(law)
          return acc
        },
        {} as Record<string, Law[]>
      )

      // Convert to array format
      let data = Object.entries(groupedLaws).map(([label, laws]) => ({
        label,
        data: laws
      }))

      // Filter by search query
      if (state.searchQuery.trim()) {
        const query = state.searchQuery.toLowerCase()
        data = data
          .map(group => ({
            ...group,
            data: group.data.filter(
              law =>
                law.title.toLowerCase().includes(query) ||
                law.subtitle.toLowerCase().includes(query) ||
                law.content.toLowerCase().includes(query) ||
                law.excerp.toLowerCase().includes(query) ||
                law.section.toLowerCase().includes(query)
            )
          }))
          .filter(group => group.data.length > 0)
      }

      return data
    },
    filteredLaws: state => {
      let data: Law[] = state.selectedSection == 'federal' ? state.federal : state.eo

      if (state.filterType !== 'all') {
        if (state.selectedSection == 'federal') {
          const categoryIndex = state.filterType as number
          const categories = [
            ...new Set(state.federal.map(law => law.category || 'Uncategorized'))
          ].filter(c => c)
          if (categories[categoryIndex]) {
            data = data.filter(law => law.category === categories[categoryIndex])
          }
        } else if (state.selectedSection == 'eo') {
          const categoryIndex = state.filterType as number
          const categories = ['Administration EO', 'Law Enforcement EO', 'Organizational EO']
          if (categories[categoryIndex]) {
            data = data.filter(law => law.category === categories[categoryIndex])
          }
        }
      }

      if (state.searchQuery.trim()) {
        const query = state.searchQuery.toLowerCase()
        data = data.filter(d => {
          return (
            d.title.toLowerCase().includes(query) ||
            d.subtitle.toLowerCase().includes(query) ||
            d.content.toLowerCase().includes(query) ||
            d.excerp.toLowerCase().includes(query)
          )
        })
      }

      return data
    },
    filteredMunicipal: state => {
      let data: MunicipalGroup[] = state.municipal

      if (state.filterType !== 'all') {
        const index: number = state.filterType as number
        data = data.filter((_, i) => i == index)
      }
      if (state.searchQuery.trim()) {
        const query = state.searchQuery.toLowerCase()
        data = data.map(dt => {
          return {
            ...dt,
            data: dt.data.filter(
              d =>
                d.title.toLowerCase().includes(query) ||
                d.subtitle.toLowerCase().includes(query) ||
                d.content.toLowerCase().includes(query) ||
                d.excerp.toLowerCase().includes(query)
            )
          }
        })
      }

      return data
    }
  },

  actions: {
    async setSection(section: 'federal' | 'eo' | 'municipal') {
      this.selectedSection = section
      this.searchQuery = ''
      this.filterType = 'all'

      if (section === 'federal' && !this.federalLoaded) {
        await this.fetchFederal()
      } else if (section === 'eo' && !this.eoLoaded) {
        await this.fetchEO()
      } else if (section === 'municipal' && !this.municipalLoaded) {
        await this.fetchMunicipal()
      }
    },

    async fetchFederal() {
      if (this.federalLoaded) return

      try {
        this.loading = true
        this.error = null

        const { getToken } = useApiToken()
        const token = await getToken('laws/federal')

        const response = await $fetch('/api/laws/federal', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        this.federal = response as Law[]
        this.federalLoaded = true
      } catch (error) {
        dError('Error fetching federal laws:', error)
        this.error = 'Failed to fetch federal laws'
      } finally {
        this.loading = false
      }
    },

    async fetchEO() {
      if (this.eoLoaded) return

      try {
        this.loading = true
        this.error = null

        const { getToken } = useApiToken()
        const token = await getToken('laws/eo')

        const response = await $fetch('/api/laws/eo', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        this.eo = response as Law[]
        this.eoLoaded = true
      } catch (error) {
        dError('Error fetching executive orders:', error)
        this.error = 'Failed to fetch executive orders'
      } finally {
        this.loading = false
      }
    },

    async fetchMunicipal() {
      if (this.municipalLoaded) return

      try {
        this.loading = true
        this.error = null

        const { getToken } = useApiToken()
        const token = await getToken('laws/municipal')

        const response = await $fetch('/api/laws/municipal', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        this.municipal = response as MunicipalGroup[]
        this.municipalLoaded = true
      } catch (error) {
        dError('Error fetching municipal laws:', error)
        this.error = 'Failed to fetch municipal laws'
      } finally {
        this.loading = false
      }
    }
  }
})
