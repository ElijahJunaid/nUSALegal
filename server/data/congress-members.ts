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

export const activeSessions: number = 1

export const congressMembers: CongressMember[] = [
  {
    name: 'Claire Wolfewere',
    username: 'ClaireWolfwere',
    role: 'Senator',
    state: 'Minnesota',
    party: 'Forward',
    chamber: 'Senate',
    status: 'Active',
    initials: 'CW',
    term: '1st',
    class: 'Class I'
  },
  {
    name: 'Jane Sample',
    username: 'jane_sample',
    role: 'Representative',
    state: 'TX',
    party: 'Pioneer',
    chamber: 'House',
    status: 'Active',
    initials: 'JS',
    term: '1st',
    class: ''
  }
]

export const formerCongressMembers: CongressMember[] = []
