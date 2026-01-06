import { defineStore } from 'pinia'
import { useApiToken } from '~/composables/useApiToken'

export interface Constitution {
    title: string
    description: string
    content?: string
    hasArticle: boolean
    key?: string
}

export interface ConstitutionArticle {
    title: string
    sections: ConstitutionArticleSection[]
}

export interface ConstitutionArticleSection {
    title: string
    content: string
}

export const useConstitutionStore = defineStore('constitution', {
    state: () => ({
        selectedSection: 'constitution' as 'constitution' | 'constitution-amendments',
        searchQuery: '',
        constitution: [] as Constitution[],
        constitutionAmendments: [] as Constitution[],
        constitutionLoaded: false,
        constitutionAmandmentsLoaded: false,
        loading: false,
        error: null as string | null,
    }),
    getters: {
        filteredData: (state) => {
            let data: Constitution[] = state.selectedSection == 'constitution' ? state.constitution : state.constitutionAmendments;

            if (state.searchQuery.trim()) {
                const query = state.searchQuery.toLowerCase()
                data = data.filter(d => d.title.toLowerCase().includes(query) || d.description.toLowerCase().includes(query) || (d.content ?? '').toLowerCase().includes(query))
            }

            return data
        },
    },
    actions: {
        async setSection(section: 'constitution' | 'constitution-amendments') {
            this.selectedSection = section
            this.searchQuery = ''

            if (section === 'constitution' && !this.constitutionLoaded) {
                await this.fetchConstitution()
            } else if (section === 'constitution-amendments' && !this.constitutionAmandmentsLoaded) {
                await this.fetchConstitutionAmandments()
            }
        },

        async fetchConstitution() {
            if (this.constitutionLoaded) {
                return
            }

            this.loading = true
            this.error = null

            try {
                const { getToken } = useApiToken()
                const token = await getToken('constitution/constitution')

                const data = await $fetch<Constitution[]>('/api/constitution/constitution', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })

                this.constitution = data
                this.constitutionLoaded = true
            } catch (err: any) {
                this.error = err?.data?.statusMessage || err?.message || 'Failed to fetch Constitution'
                console.error('Failed to fetch Constitution:', err)
            } finally {
                this.loading = false
            }
        },
        async fetchConstitutionAmandments() {
            if (this.constitutionAmandmentsLoaded) {
                return
            }

            this.loading = true
            this.error = null

            try {
                const tokenResponse = await $fetch('/api/auth/token', {
                    method: 'POST',
                    body: { endpoint: 'constitution/constitution-amandments' }
                })
                const data = await $fetch<Constitution[]>('/api/constitution/constitution-amandments', {
                    headers: {
                        Authorization: `Bearer ${tokenResponse.token}`
                    }
                })

                this.constitutionAmendments = data
                this.constitutionAmandmentsLoaded = true
            } catch (err: any) {
                this.error = err?.data?.statusMessage || err?.message || 'Failed to fetch Constitution Amandments'
                console.error('Failed to fetch Constitution Amandments:', err)
            } finally {
                this.loading = false
            }
        },
    }
})