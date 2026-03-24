import { defineStore } from 'pinia'
import { useApiToken } from '~/composables/useApiToken'
import { dError } from '~/plugins/debug-logger.client'

export interface CongressMember {
  name: string
  username: string
  role: string
  state: string
  party: string
  chamber: string
  status: string
  initials: string
  term?: string
  class?: string
}

export const useCongressStore = defineStore('congress', {
  state: () => ({
    members: [] as CongressMember[],
    formerMembers: [] as CongressMember[],
    activeSessions: 0,
    loaded: false,
    formerLoaded: false,
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
        dError('Failed to fetch congress members:', err)
      } finally {
        this.loading = false
      }
    },

    async fetchFormerMembers() {
      if (this.formerLoaded) return

      try {
        const { getToken } = useApiToken()
        const token = await getToken('congress/former-members')

        const data = await $fetch<{ members: CongressMember[] }>('/api/congress/former-members', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        this.formerMembers = data.members
        this.formerLoaded = true
      } catch (err: unknown) {
        const e = err as { data?: { statusMessage?: string }; message?: string }
        this.error = e?.data?.statusMessage || e?.message || 'Failed to fetch former members'
        dError('Failed to fetch former congress members:', err)
      }
    }
  }
})
