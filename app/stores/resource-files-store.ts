import { defineStore } from 'pinia'

export interface ResourceFile {
    title: string
    link: string
}

export const useResourceFileStore = defineStore('resource-file', {
    state: () => ({
        searchQuery: '',
        data: [] as ResourceFile[],
        isLoaded: false,
        loading: false,
        error: null as string | null,
    }),
    getters: {
        filteredData: (state) => {
            let data: ResourceFile[] = state.data;

            if (state.searchQuery.trim()) {
                const query = state.searchQuery.toLowerCase()
                data = data.filter(d => d.title.toLowerCase().includes(query))
            }

            return data
        },
    },
    actions: {
        async get() {
            this.searchQuery = ''

            if (!this.isLoaded) {
                await this.fetchResourceFile()
            }
        },

        async fetchResourceFile() {
            if (this.isLoaded) {
                return
            }

            this.loading = true
            this.error = null

            try {
                const tokenResponse = await $fetch('/api/auth/token', {
                    method: 'POST',
                    body: { endpoint: 'resources/files' }
                })
                const data = await $fetch<ResourceFile[]>('/api/resources/files', {
                    headers: {
                        Authorization: `Bearer ${tokenResponse.token}`
                    }
                })

                this.data = data
                this.isLoaded = true
            } catch (err: any) {
                this.error = err?.data?.statusMessage || err?.message || 'Failed to fetch Resource Files'
                console.error('Failed to fetch Resource Files:', err)
            } finally {
                this.loading = false
            }
        },
    }
})