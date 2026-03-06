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
        constitutionAmendmentsLoaded: false,
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
            } else if (section === 'constitution-amendments' && !this.constitutionAmendmentsLoaded) {
                await this.fetchConstitutionAmendments()
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
        async fetchConstitutionAmendments() {
            if (this.constitutionAmendmentsLoaded) {
                return
            }

            this.loading = true
            this.error = null

            try {
                const tokenResponse = await $fetch<{ token: string; expiresIn: string }>('/api/auth/token', {
                    method: 'POST',
                    body: { endpoint: 'constitution/constitution-amendments' }
                })
                const data = await $fetch<Constitution[]>('/api/constitution/constitution-amendments', {
                    headers: {
                        Authorization: `Bearer ${tokenResponse.token}`
                    }
                })

                this.constitutionAmendments = data
                this.constitutionAmendmentsLoaded = true
            } catch (err: any) {
                this.error = err?.data?.statusMessage || err?.message || 'Failed to fetch Constitution Amendments'
                console.error('Failed to fetch Constitution Amendments:', err)
            } finally {
                this.loading = false
            }
        },
    }
})