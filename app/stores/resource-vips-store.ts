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
    PRIMARY_URL: 'https://users.roblox.com/v1',
    FALLBACK_URL: 'https://www.roblox.com/users',
    TIMEOUT: 5000
}

const DEFAULT_AVATAR = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iIzMzMzMzMyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjE4IiBmaWxsPSIjZmZmIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+VklQPC90ZXh0Pjwvc3ZnPg=='

export const useResourceVIPStore = defineStore('resource-vips', {
    state: () => ({
        searchQuery: '',
        data: [] as VIPEnriched[],
        loading: false,
        isLoaded: false,
        error: null as string | null,
        robloxAPIUnreachable: false
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
            // Early check if Roblox APIs are reachable
            if (this.robloxAPIUnreachable) {
                throw new Error(`Roblox APIs are unreachable - using fallback data`)
            }

            const controller = new AbortController()
            const timeout = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT)

            try {
                // Try Roblox API v1 first
                const response = await fetch(`${API_CONFIG.PRIMARY_URL}${endpoint}`, {
                    signal: controller.signal,
                    headers: {
                        'Accept': 'application/json'
                    }
                })
                clearTimeout(timeout)
                return response
            } catch (error) {
                console.warn(`Primary Roblox API failed for ${endpoint}, trying fallback`)
                try {
                    // Extract userId from endpoint (/users/123 -> 123)
                    const userId = endpoint.replace('/users/', '')
                    // Fallback to scraping profile pages
                    const fallbackResponse = await fetch(`${API_CONFIG.FALLBACK_URL}/${userId}/profile`, {
                        headers: {
                            'Accept': 'text/html'
                        }
                    })
                    return fallbackResponse
                } catch (fallbackError) {
                    // Mark Roblox APIs as unreachable to prevent repeated failed requests
                    this.robloxAPIUnreachable = true
                    console.error(`Both Roblox APIs failed for ${endpoint} - marking as unreachable`)
                    throw new Error(`Both Roblox APIs failed for ${endpoint}`)
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
            // Skip enrichment if Roblox APIs are unreachable
            if (this.robloxAPIUnreachable) {
                console.log('Skipping VIP enrichment - Roblox APIs are unreachable')
                // Mark all VIPs as not loading with no errors since we have default data
                this.data = this.data.map(vip => ({
                    ...vip,
                    isLoading: false,
                    hasError: false
                }))
                return
            }

            const enrichmentPromises = this.data.map(async (vip, index) => {
                try {
                    const [userResponse, avatarResponse] = await Promise.allSettled([
                        this.fetchWithFallback(`/users/${vip.userId}`),
                        this.fetchWithFallback(`/users/${vip.userId}`)
                    ])

                    let userData = null
                    let avatarData = null

                    if (userResponse.status === 'fulfilled' && userResponse.value.ok) {
                        // Try to parse as JSON first (API response)
                        try {
                            userData = await userResponse.value.json()
                        } catch {
                            // If JSON fails, parse as HTML (profile page fallback)
                            const html = await userResponse.value.text()
                            const usernameMatch = html.match(/<title>(.*?) - Profile<\/title>/)
                            if (usernameMatch) {
                                userData = { name: usernameMatch[1] }
                            }
                        }
                    }
                    
                    if (avatarResponse.status === 'fulfilled' && avatarResponse.value.ok) {
                        // For avatars, we'll extract from the profile page HTML
                        const html = await avatarResponse.value.text()
                        const avatarMatch = html.match(/<meta property="og:image" content="([^"]+)"/)
                        if (avatarMatch) {
                            avatarData = { data: [{ imageUrl: avatarMatch[1] }] }
                        }
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