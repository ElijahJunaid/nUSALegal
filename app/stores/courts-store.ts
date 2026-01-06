import { defineStore } from 'pinia'

interface CourtCase {
    title: string
    description: string
    type: string
    docket: string
    citation: string
}

interface VolumeData {
    volume: number
    title: string
    cases: CourtCase[]
    isEmpty?: boolean
    emptyMessage?: string
}

export const useCourtsStore = defineStore('courts', {
    state: () => ({
        selectedVolume: 2,
        searchQuery: '',
        volumesCache: {} as Record<number, VolumeData>,
        loading: false,
        error: null as string | null,
        availableVolumeNumbers: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17]
    }),

    getters: {
        currentVolume: (state) => {
            return state.volumesCache[state.selectedVolume] || null
        },
        availableVolumes: (state) => {
            return state.availableVolumeNumbers.map((vol) => ({
                volume: vol,
                title: `Supreme Court Board Volume ${vol}`
            }))
        },
        filteredCases: (state) => {
            const currentVol = state.volumesCache[state.selectedVolume]
            if (!currentVol || currentVol.isEmpty) {
                return []
            }

            if (!state.searchQuery.trim()) {
                return currentVol.cases
            }

            const query = state.searchQuery.toLowerCase()
            return currentVol.cases.filter((courtCase) => {
                return (
                    courtCase.title.toLowerCase().includes(query) ||
                    courtCase.description.toLowerCase().includes(query) ||
                    courtCase.type.toLowerCase().includes(query) ||
                    courtCase.docket.toLowerCase().includes(query) ||
                    courtCase.citation.toLowerCase().includes(query)
                )
            })
        }
    },

    actions: {
        async setVolume(vol: number) {
            this.searchQuery = '';
            this.selectedVolume = vol;

            if (!this.volumesCache[vol]) {
                await this.fetchVolume(vol)
            }
        },

        async fetchVolume(vol: number) {
            if (this.volumesCache[vol]) {
                return
            }

            this.loading = true
            this.error = null

            try {
                const tokenResponse = await $fetch('/api/auth/token', {
                    method: 'POST',
                    body: { endpoint: `courts/${vol}` }
                })
                const data = await $fetch<VolumeData>(`/api/courts/${vol}`, {
                    headers: {
                        Authorization: `Bearer ${tokenResponse.token}`
                    }
                })

                this.volumesCache[vol] = data
            } catch (err: any) {
                this.error = err?.data?.statusMessage || err?.message || `Failed to fetch volume ${vol}`
                console.error(`Failed to fetch volume ${vol}:`, err)
            } finally {
                this.loading = false
            }
        }
    }
})