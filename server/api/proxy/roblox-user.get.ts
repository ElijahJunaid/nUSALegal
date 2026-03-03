import { defineEventHandler, createError } from 'h3'

export default defineEventHandler(async (event) => {
    const url = event.node?.req?.url || ''
    const urlParams = new URLSearchParams(url.split('?')[1])
    const userId = urlParams.get('userId')

    if (!userId) {
        throw createError({
            status: 400,
            statusText: 'userId query parameter is required'
        })
    }

    try {
        const [userResponse, avatarResponse] = await Promise.all([
            fetch(`https://users.roblox.com/v1/users/${userId}`, {
                headers: { 'Accept': 'application/json' },
                signal: AbortSignal.timeout(3000)
            }),
            fetch(`https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${userId}&size=150x150&format=Png`, {
                headers: { 'Accept': 'application/json' },
                signal: AbortSignal.timeout(3000)
            })
        ])

        if (userResponse.ok) {
            const userData = await userResponse.json()
            let avatarUrl = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iIzMzMzMzMyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjE4IiBmaWxsPSIjZmZmIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+VklQPC90ZXh0Pjwvc3ZnPg=='

            if (avatarResponse.ok) {
                const avatarData = await avatarResponse.json()
                if (avatarData.data?.[0]?.imageUrl) {
                    avatarUrl = avatarData.data[0].imageUrl
                }
            }

            return {
                success: true,
                data: {
                    name: userData.name,
                    id: userData.id,
                    avatarUrl
                }
            }
        }

        throw createError({
            status: userResponse.status,
            statusText: 'Roblox API request failed'
        })
    } catch (error: any) {
        console.warn(`Failed to fetch Roblox user ${userId}:`, error)
        throw createError({
            status: 500,
            statusText: error.message || 'Failed to fetch user data'
        })
    }
})