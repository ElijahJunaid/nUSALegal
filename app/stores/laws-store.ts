import { defineStore } from 'pinia'

interface MunicipalGroup {
    label: string
    data: Law[]
}

export interface Law {
    title: string
    subtitle: string
    content: string
    excerp: string
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
            const categories = [...new Set(state.federal.map(law => (law as any).category || 'Uncategorized'))];
            return categories.filter(c => c);
        },
        filterEOList(): string[] {
            return ['Administration EO', 'Law Enforcement EO', 'Organizational EO'];
        },
        filterMunicipalList(state): string[] {
            let data: MunicipalGroup[] = state.municipal;

            return data.map(d => d.label);

        },
        filteredLaws: (state) => {
            let data: Law[] = state.selectedSection == 'federal' ? state.federal : state.eo

            if (state.filterType !== 'all') {
                const categoryIndex = state.filterType as number;
                const categories = state.selectedSection == 'federal' 
                    ? [...new Set(state.federal.map(law => (law as any).category || 'Uncategorized'))].filter(c => c)
                    : [];
                if (categories[categoryIndex]) {
                    data = data.filter(law => (law as any).category === categories[categoryIndex]);
                }
            }

            if (state.searchQuery.trim()) {
                const query = state.searchQuery.toLowerCase()
                data = data.filter(
                    (d) => {
                        return d.title.toLowerCase().includes(query) || d.subtitle.toLowerCase().includes(query) || d.content.toLowerCase().includes(query) || d.excerp.toLowerCase().includes(query);
                    }
                )
            }

            return data
        },
        filteredMunicipal: (state) => {
            let data: MunicipalGroup[] = state.municipal;

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
            if (this.federalLoaded) {
                return
            }

            this.loading = true
            this.error = null

            try {
                const tokenResponse = await $fetch<{ token: string; expiresIn: string }>('/api/auth/token', {
                    method: 'POST',
                    body: { endpoint: 'laws/federal' }
                })
                const data = await $fetch<Law[]>('/api/laws/federal', {
                    headers: {
                        Authorization: `Bearer ${tokenResponse.token}`
                    }
                })

                this.federal = data
                this.federalLoaded = true
            } catch (err: any) {
                this.error = err?.data?.statusMessage || err?.message || 'Failed to fetch Federal'
                console.error('Failed to fetch Federal:', err)
            } finally {
                this.loading = false
            }
        },
        async fetchEO() {
            if (this.eoLoaded) {
                return
            }

            this.loading = true
            this.error = null

            try {
                const tokenResponse = await $fetch<{ token: string; expiresIn: string }>('/api/auth/token', {
                    method: 'POST',
                    body: { endpoint: 'laws/eo' }
                })
                const data = await $fetch<Law[]>('/api/laws/eo', {
                    headers: {
                        Authorization: `Bearer ${tokenResponse.token}`
                    }
                })

                this.eo = data
                this.eoLoaded = true
            } catch (err: any) {
                this.error = err?.data?.statusMessage || err?.message || 'Failed to fetch EO data'
                console.error('Failed to fetch EO data:', err)
            } finally {
                this.loading = false
            }
        },
        async fetchMunicipal() {
            if (this.municipalLoaded) {
                return
            }

            this.loading = true
            this.error = null

            try {
                const tokenResponse = await $fetch<{ token: string; expiresIn: string }>('/api/auth/token', {
                    method: 'POST',
                    body: { endpoint: 'laws/municipal' }
                })
                const data = await $fetch<MunicipalGroup[]>('/api/laws/municipal', {
                    headers: {
                        Authorization: `Bearer ${tokenResponse.token}`
                    }
                })

                this.municipal = data
                this.municipalLoaded = true
            } catch (err: any) {
                this.error = err?.data?.statusMessage || err?.message || 'Failed to fetch Municipal'
                console.error('Failed to fetch Municipal:', err)
            } finally {
                this.loading = false
            }
        }
    }
})