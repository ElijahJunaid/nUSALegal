import { defineStore } from 'pinia'

interface FederalRulesGroup {
    label: string
    data: FederalRules[]
}

export interface FederalRules {
    title: string
    subtitle: string
    content: string
    excerp: string
}

export const useFederalRulesStore = defineStore('federal-rules', {
    state: () => ({
        selectedSection: 'frcp' as 'frcp' | 'frcmp',
        searchQuery: '',
        filterType: 'all' as string | number,

        frcp_group: [] as FederalRulesGroup[],
        frcmp_group: [] as FederalRulesGroup[],
        frcpLoaded: false,
        frcmpLoaded: false,
        loading: false,
        error: null as string | null
    }),

    getters: {
        filterList: (state) => {
            let data: FederalRulesGroup[] = state.selectedSection == 'frcp' ? state.frcp_group : state.frcmp_group;

            return data.map(d => d.label);

        },
        filteredFederalRules: (state) => {
            let data: FederalRulesGroup[] = state.selectedSection == 'frcp' ? state.frcp_group : state.frcmp_group

            if (state.filterType !== 'all') {
                const index: number = state.filterType as number;
                data = data.filter((_, i) => i == index);
            }
            if (state.searchQuery.trim()) {
                const query = state.searchQuery.toLowerCase()
                data = data.map(
                    (dt) => {
                        return {
                            ...dt,
                            data: dt.data.filter(d => d.title.toLowerCase().includes(query) || d.subtitle.toLowerCase().includes(query) || d.content.toLowerCase().includes(query) || d.excerp.toLowerCase().includes(query))
                        }
                    }
                )
            }

            return data
        },
    },

    actions: {
        async setSection(section: 'frcp' | 'frcmp') {
            this.selectedSection = section
            this.searchQuery = ''
            this.filterType = 'all'

            if (section === 'frcp' && !this.frcpLoaded) {
                await this.fetchFRCP()
            } else if (section === 'frcmp' && !this.frcmpLoaded) {
                await this.fetchFRCMP()
            }
        },

        async fetchFRCP() {
            if (this.frcpLoaded) {
                return
            }

            this.loading = true
            this.error = null

            try {
                const tokenResponse = await $fetch('/api/auth/token', {
                    method: 'POST',
                    body: { endpoint: 'federal-rules/frcp' }
                })

                const data = await $fetch<FederalRulesGroup[]>('/api/federal-rules/frcp', {
                    headers: {
                        Authorization: `Bearer ${tokenResponse.token}`
                    }
                })

                this.frcp_group = data
                this.frcpLoaded = true
            } catch (err: any) {
                this.error = err?.data?.statusMessage || err?.message || 'Failed to fetch FRCP'
                console.error('Failed to fetch FRCP:', err)
            } finally {
                this.loading = false
            }
        },

        async fetchFRCMP() {
            if (this.frcmpLoaded) {
                return
            }

            this.loading = true
            this.error = null

            try {
                const tokenResponse = await $fetch('/api/auth/token', {
                    method: 'POST',
                    body: { endpoint: 'federal-rules/frcmp' }
                })
                const data = await $fetch<FederalRulesGroup[]>('/api/federal-rules/frcmp', {
                    headers: {
                        Authorization: `Bearer ${tokenResponse.token}`
                    }
                })

                this.frcmp_group = data
                this.frcmpLoaded = true
            } catch (err: any) {
                this.error = err?.data?.statusMessage || err?.message || 'Failed to fetch FRCMP'
                console.error('Failed to fetch FRCMP:', err)
            } finally {
                this.loading = false
            }
        }
    }
})