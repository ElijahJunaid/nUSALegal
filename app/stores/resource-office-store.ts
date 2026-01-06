import { defineStore } from 'pinia'

interface OfficeGroup {
    label: string
    data: Office[]
}

export interface Office {
    title: string
    description: string
}

export const useResourceOfficeStore = defineStore('resource-office', {
    state: () => ({
        searchQuery: '',
        filterType: 'all' as string,
        data: [] as OfficeGroup[],
        loading: false,
        isLoaded: false,
        error: null as string | null
    }),

    getters: {
        officeGroupList: (state) => {
            let data: OfficeGroup[] = state.data;

            return data.map(d => d.label);

        },
        filteredData: (state) => {
            let data: OfficeGroup[] = state.data;

            if (state.filterType !== 'all') {
                data = data.filter(d => d.label === state.filterType)
            }
            if (state.searchQuery.trim()) {
                const query = state.searchQuery.toLowerCase()
                data = data.map(dt => {
                    return {
                        ...dt,
                        data: dt.data.filter((d) => d.title.toLocaleLowerCase().includes(query) || d.description.toLocaleLowerCase().includes(query))
                    }
                }).filter(dt => dt.data.length > 0)
            }

            return data
        },
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
                const tokenResponse = await $fetch('/api/auth/token', {
                    method: 'POST',
                    body: { endpoint: 'resources/office' }
                })
                const data = await $fetch<OfficeGroup[]>('/api/resources/office', {
                    headers: {
                        Authorization: `Bearer ${tokenResponse.token}`
                    }
                })

                this.data = data
                this.isLoaded = true
            } catch (err: any) {
                this.error = err?.data?.statusMessage || err?.message || 'Failed to fetch office resource'
                console.error('Failed to fetch office resource:', err)
            } finally {
                this.loading = false
            }
        },
    }
})