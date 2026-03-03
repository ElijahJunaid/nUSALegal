import { defineStore } from 'pinia'

export interface VIPBase {
    userId: string
    title: string
    reason: string
}

export interface VIPUser {
    username: string
    profileUrl: string
}

export interface VIPAvatar {
    imageUrl: string
}

export interface VIPEnriched extends VIPBase {
    user: VIPUser
    avatar: VIPAvatar
    isLoading: boolean
    hasError: boolean
}

export const useResourceVIPStore = defineStore('resource-vips', {
    state: () => ({
        searchQuery: '',
        data: [] as VIPEnriched[],
        loading: false,
        isLoaded: false,
        error: null as string | null
    }),

    getters: {
        filteredData: (state) => {
            let data: VIPEnriched[] = state.data;

            if (state.searchQuery.trim()) {
                const query = state.searchQuery.toLowerCase()
                data = data.filter((vip) =>
                    vip.title.toLowerCase().includes(query) ||
                    vip.reason.toLowerCase().includes(query) ||
                    vip.user.username.toLowerCase().includes(query)
                )
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
                const tokenResponse = await $fetch<{ token: string; expiresIn: string }>('/api/auth/token', {
                    method: 'POST',
                    body: { endpoint: 'resources/vips' }
                })
                
                const baseData = await $fetch<VIPBase[]>('/api/resources/vips', {
                    headers: {
                        Authorization: `Bearer ${tokenResponse.token}`
                    }
                })

                this.data = baseData.map(vip => ({
                    ...vip,
                    user: {
                        username: `User ${vip.userId}`,
                        profileUrl: `https://www.roblox.com/users/${vip.userId}/profile`
                    },
                    avatar: {
                        imageUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iIzMzMzMzMyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjE4IiBmaWxsPSIjZmZmIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+VklQPC90ZXh0Pjwvc3ZnPg=='
                    },
                    isLoading: true,
                    hasError: false
                }))

                this.isLoaded = true
                this.loading = false

                await this.enrichVIPData()

            } catch (err: any) {
                this.error = err?.data?.statusMessage || err?.message || 'Failed to fetch VIP resource'
                console.error('Failed to fetch VIP resource:', err)
                this.loading = false
            }
        },

        async enrichVIPData() {
            const enrichmentPromises = this.data.map(async (vip, index) => {
                try {
                    const userData = await $fetch<{ success: boolean; data: { name: string; id: number; avatarUrl: string } }>(`/api/proxy/roblox-user?userId=${vip.userId}`)
                    
                    this.data[index] = {
                        ...vip,
                        user: {
                            username: userData.data.name,
                            profileUrl: `https://www.roblox.com/users/${vip.userId}/profile`
                        },
                        avatar: {
                            imageUrl: userData.data.avatarUrl
                        },
                        isLoading: false,
                        hasError: false
                    }
                } catch (error) {
                    console.warn(`Failed to enrich data for user ${vip.userId}:`, error)
                    this.data[index] = {
                        ...vip,
                        isLoading: false,
                        hasError: true
                    }
                }
            })

            await Promise.all(enrichmentPromises)
        }
    }
})