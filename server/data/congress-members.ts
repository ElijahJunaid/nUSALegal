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

export const activeSessions: number = 1

export const congressMembers: CongressMember[] = [
  {
    name: 'John Example',
    username: 'john_example',
    role: 'Senator',
    state: 'CA',
    party: 'Forward',
    chamber: 'Senate',
    status: 'Active',
    initials: 'JE'
  },
  {
    name: 'Jane Sample',
    username: 'jane_sample',
    role: 'Representative',
    state: 'TX',
    party: 'Pioneer',
    chamber: 'House',
    status: 'Active',
    initials: 'JS'
  }
]
