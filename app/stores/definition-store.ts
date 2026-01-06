import { defineStore } from 'pinia'

export interface Definition {
    title: string
    description: string
}

export const useDefinitionStore = defineStore('definition', {
    state: () => ({
        searchQuery: '',
        data: [] as Definition[],
        isLoaded: false,
        loading: false,
        error: null as string | null,
    }),
    getters: {
        filteredData: (state) => {
            let data: Definition[] = state.data;

            if (state.searchQuery.trim()) {
                const query = state.searchQuery.toLowerCase()
                data = data.filter(d => d.title.toLowerCase().includes(query) || d.description.toLowerCase().includes(query))
            }

            return data
        },
    },
    actions: {
        async get() {
            this.searchQuery = ''

            if (!this.isLoaded) {
                await this.fetchDefinition()
            }
        },

        async fetchDefinition() {
            if (this.isLoaded) {
                return
            }

            this.loading = true
            this.error = null

            try {
                const tokenResponse = await $fetch('/api/auth/token', {
                    method: 'POST',
                    body: { endpoint: 'resources/definitions' }
                })
                const data = await $fetch<Definition[]>('/api/resources/definitions', {
                    headers: {
                        Authorization: `Bearer ${tokenResponse.token}`
                    }
                })

                this.data = data
                this.isLoaded = true
            } catch (err: any) {
                this.error = err?.data?.statusMessage || err?.message || 'Failed to fetch Definition'
                console.error('Failed to fetch Definition:', err)
            } finally {
                this.loading = false
            }
        },
    }
})