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

const API_CONFIG = {
    PRIMARY_URL: 'https://www.nusa.gg/resource-vips',
    FALLBACK_URL: 'https://api.nusa.gg/resource-vips',
    TIMEOUT: 5000
}

const DEFAULT_AVATAR = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iIzMzMzMzMyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjE4IiBmaWxsPSIjZmZmIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+VklQPC90ZXh0Pjwvc3ZnPg=='

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
        async fetchWithFallback(endpoint: string) {
            const controller = new AbortController()
            const timeout = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT)

            try {
                const response = await fetch(`${API_CONFIG.PRIMARY_URL}${endpoint}`, {
                    signal: controller.signal
                })
                clearTimeout(timeout)
                return response
            } catch (error) {
                console.warn(`Primary API failed for ${endpoint}, trying fallback`)
                try {
                    const fallbackResponse = await fetch(`${API_CONFIG.FALLBACK_URL}${endpoint}`)
                    return fallbackResponse
                } catch (fallbackError) {
                    throw new Error(`Both primary and fallback APIs failed for ${endpoint}`)
                }
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
                        imageUrl: DEFAULT_AVATAR
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
                    const [userResponse, avatarResponse] = await Promise.allSettled([
                        this.fetchWithFallback(`/users/${vip.userId}`),
                        this.fetchWithFallback(`/avatar/${vip.userId}`)
                    ])

                    let userData = null
                    let avatarData = null

                    if (userResponse.status === 'fulfilled' && userResponse.value.ok) {
                        userData = await userResponse.value.json()
                    }
                    if (avatarResponse.status === 'fulfilled' && avatarResponse.value.ok) {
                        avatarData = await avatarResponse.value.json()
                    }

                    this.data[index] = {
                        ...vip,
                        user: {
                            username: userData?.name || `User ${vip.userId}`,
                            profileUrl: `https://www.roblox.com/users/${vip.userId}/profile`
                        },
                        avatar: {
                            imageUrl: avatarData?.data?.[0]?.imageUrl || DEFAULT_AVATAR
                        },
                        isLoading: false,
                        hasError: !userData && !avatarData
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
        },
    }
})