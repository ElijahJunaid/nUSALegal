import { defineStore } from 'pinia'

export const useCourtProcedureStore = defineStore('resource-court-procedure', {
    state: () => ({
        searchQuery: '',
        data: [] as string[],
        isLoaded: false,
        loading: false,
        error: null as string | null,
    }),
    getters: {
        filteredData: (state) => {
            let data: string[] = state.data;

            if (state.searchQuery.trim()) {
                const query = state.searchQuery.toLowerCase()
                data = data.filter(d => d.toLowerCase().includes(query))
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
                    body: { endpoint: 'resources/court-procedure' }
                })
                const data = await $fetch<string[]>('/api/resources/court-procedure', {
                    headers: {
                        Authorization: `Bearer ${tokenResponse.token}`
                    }
                })

                this.data = data
                this.isLoaded = true
            } catch (err: any) {
                this.error = err?.data?.statusMessage || err?.message || 'Failed to fetch Court Procedure'
                console.error('Failed to fetch Court Procedure:', err)
            } finally {
                this.loading = false
            }
        },
    }
})