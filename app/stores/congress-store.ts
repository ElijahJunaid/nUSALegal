import { defineStore } from 'pinia'
import { useApiToken } from '~/composables/useApiToken'

export interface CongressMember {
  name: string
  username: string
  role: string
  state: string
  party: string
  chamber: string
  status: string
  initials: string
}

export const useCongressStore = defineStore('congress', {
  state: () => ({
    members: [] as CongressMember[],
    activeSessions: 0,
    loaded: false,
    loading: false,
    error: null as string | null
  }),

  getters: {
    senateMembers: state => state.members.filter(m => m.chamber === 'Senate'),
    houseMembers: state => state.members.filter(m => m.chamber === 'House')
  },

  actions: {
    async fetchMembers() {
      if (this.loaded) return

      this.loading = true
      this.error = null

      try {
        const { getToken } = useApiToken()
        const token = await getToken('congress/members')

        const data = await $fetch<{ members: CongressMember[]; activeSessions: number }>(
          '/api/congress/members',
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )

        this.members = data.members
        this.activeSessions = data.activeSessions
        this.loaded = true
      } catch (err: unknown) {
        const e = err as { data?: { statusMessage?: string }; message?: string }
        this.error = e?.data?.statusMessage || e?.message || 'Failed to fetch congress members'
        console.error('Failed to fetch congress members:', err)
      } finally {
        this.loading = false
      }
    }
  }
})
