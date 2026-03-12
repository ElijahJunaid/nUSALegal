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
  // Senate - Active
  {
    name: 'Claire Wolfewere',
    username: 'ClaireWolfwere',
    role: 'Senator',
    state: 'Minnesota',
    party: 'Forward',
    chamber: 'Senate',
    status: 'Active',
    initials: 'CW',
    term: '',
    class: ''
  },
  {
    name: 'SightFalls',
    username: 'SightFalls',
    role: 'Senator',
    state: 'Mississippi',
    party: 'Forward',
    chamber: 'Senate',
    status: 'Active',
    initials: 'SF',
    term: '',
    class: ''
  },
  {
    name: 'old_dude47',
    username: 'old_dude47',
    role: 'Senate Minority Leader',
    state: 'Forward',
    party: 'Forward',
    chamber: 'Senate',
    status: 'Active',
    initials: 'OD',
    term: '',
    class: ''
  },
  {
    name: 'johnyguy12',
    username: 'johnyguy12',
    role: 'Senator',
    state: 'Pioneer',
    party: 'Pioneer',
    chamber: 'Senate',
    status: 'Active',
    initials: 'JG',
    term: '',
    class: ''
  },
  {
    name: 'issjrjfh',
    username: 'issjrjfh',
    role: 'President Pro-Tempore',
    state: 'Pioneer',
    party: 'Pioneer',
    chamber: 'Senate',
    status: 'Active',
    initials: 'IJ',
    term: '',
    class: ''
  },
  {
    name: 'Epicwarrior_99',
    username: 'Epicwarrior_99',
    role: 'Senator',
    state: 'Pioneer',
    party: 'Pioneer',
    chamber: 'Senate',
    status: 'Active',
    initials: 'EW',
    term: '',
    class: ''
  },
  {
    name: 'DylanGrunk',
    username: 'DylanGrunk',
    role: 'Senator',
    state: 'Pioneer',
    party: 'Pioneer',
    chamber: 'Senate',
    status: 'Active',
    initials: 'DG',
    term: '',
    class: ''
  },
  {
    name: 'bro_yourda3568',
    username: 'bro_yourda3568',
    role: 'Senator',
    state: 'Pioneer',
    party: 'Pioneer',
    chamber: 'Senate',
    status: 'Active',
    initials: 'BY',
    term: '',
    class: ''
  },
  {
    name: 'batmanyousef2',
    username: 'batmanyousef2',
    role: 'Senate Majority Leader',
    state: 'Bikini Bottom',
    party: 'Pioneer',
    chamber: 'Senate',
    status: 'Active',
    initials: 'BM',
    term: '',
    class: ''
  },
  {
    name: 'AguilaBread',
    username: 'AguilaBread',
    role: 'Senator',
    state: 'California',
    party: 'Forward',
    chamber: 'Senate',
    status: 'Active',
    initials: 'AB',
    term: '',
    class: ''
  },
  {
    name: 'aanjdmarcus',
    username: 'aanjdmarcus',
    role: 'Secretary of the Senate',
    state: 'Pioneer',
    party: 'Pioneer',
    chamber: 'Senate',
    status: 'Active',
    initials: 'AM',
    term: '',
    class: ''
  },
  // House - Active
  {
    name: 'JohnCulture',
    username: 'JohnCulture',
    role: 'Representative',
    state: 'Michigan',
    party: 'Forward',
    chamber: 'House',
    status: 'Active',
    initials: 'JC',
    term: '',
    class: ''
  },
  {
    name: 'sharkbiteboy0225',
    username: 'sharkbiteboy0225',
    role: 'Representative',
    state: 'Pennsylvania',
    party: 'Pioneer',
    chamber: 'House',
    status: 'Active',
    initials: 'SB',
    term: '',
    class: ''
  },
  {
    name: 'zanlek5',
    username: 'zanlek5',
    role: 'Representative',
    state: 'Illinois',
    party: 'Forward',
    chamber: 'House',
    status: 'Active',
    initials: 'ZL',
    term: '',
    class: ''
  },
  {
    name: 'kingisdino',
    username: 'kingisdino',
    role: 'Representative',
    state: 'Pioneer',
    party: 'Pioneer',
    chamber: 'House',
    status: 'Active',
    initials: 'KD',
    term: 'Mar 2026 — Present',
    class: ''
  },
  {
    name: 'EternallyBlueEyes',
    username: 'EternallyBlueEyes',
    role: 'Majority Leader',
    state: 'Texas',
    party: 'Forward',
    chamber: 'House',
    status: 'Active',
    initials: 'EB',
    term: 'Nov 2025 — Present',
    class: ''
  },
  {
    name: 'UncleVicent',
    username: 'UncleVicent',
    role: 'Representative',
    state: 'Pioneer',
    party: 'Pioneer',
    chamber: 'House',
    status: 'Active',
    initials: 'UV',
    term: 'Mar 2026 — Present',
    class: ''
  },
  {
    name: 'RuckF0rce',
    username: 'RuckF0rce',
    role: 'Representative',
    state: 'Florida',
    party: 'Forward',
    chamber: 'House',
    status: 'Active',
    initials: 'RF',
    term: 'Mar 2026 — Present',
    class: ''
  },
  {
    name: 'EdmundCarter',
    username: 'EdmundCarter',
    role: 'Representative',
    state: 'Forward',
    party: 'Forward',
    chamber: 'House',
    status: 'Active',
    initials: 'EC',
    term: 'Mar 2026 — Present',
    class: ''
  },
  {
    name: 'Sheev_PalpatineTGR',
    username: 'Sheev_PalpatineTGR',
    role: 'House Minority Leader',
    state: 'Michigan',
    party: 'Forward',
    chamber: 'House',
    status: 'Active',
    initials: 'SP',
    term: 'Mar 2026 — Present',
    class: ''
  },
  {
    name: 'PatrioticAiden',
    username: 'PatrioticAiden',
    role: 'Representative',
    state: 'Forward',
    party: 'Forward',
    chamber: 'House',
    status: 'Active',
    initials: 'PA',
    term: 'Mar 2026 — Present',
    class: ''
  },
  {
    name: 'gabezilla090909',
    username: 'gabezilla090909',
    role: 'Speaker of the House',
    state: 'Texas',
    party: 'Forward',
    chamber: 'House',
    status: 'Active',
    initials: 'GZ',
    term: 'Feb 2026 — Present',
    class: ''
  },
  {
    name: 'robloxrules756',
    username: 'robloxrules756',
    role: 'Representative',
    state: 'Illinois',
    party: 'Forward',
    chamber: 'House',
    status: 'Active',
    initials: 'RR',
    term: 'Feb 2026 — Apr 2026',
    class: ''
  }
]

export const formerCongressMembers: CongressMember[] = [
  // Senate - Former
  {
    name: 'Claire Wolfewere',
    username: 'ClaireWolfwere',
    role: 'U.S. Representative',
    state: 'Michigan',
    party: 'Forward',
    chamber: 'Senate',
    status: 'Former',
    initials: 'CW',
    term: '',
    class: ''
  },
  // House - Former
  {
    name: 'XanderOppst',
    username: 'XanderOppst',
    role: 'Representative',
    state: 'Texas',
    party: 'Pioneer',
    chamber: 'House',
    status: 'Former',
    initials: 'XO',
    term: '',
    class: ''
  },
  {
    name: 'Arman Foley',
    username: 'ArmanFoley',
    role: 'Speaker of the House',
    state: 'Virginia',
    party: 'Forward',
    chamber: 'House',
    status: 'Former',
    initials: 'AF',
    term: '',
    class: ''
  },
  {
    name: 'TacticalRummy',
    username: 'TacticalRummy',
    role: 'Representative',
    state: 'Kentucky',
    party: 'Pioneer',
    chamber: 'House',
    status: 'Former',
    initials: 'TR',
    term: '',
    class: ''
  },
  {
    name: 'Majorplayer4567',
    username: 'Majorplayer4567',
    role: 'Representative',
    state: 'Pioneer',
    party: 'Pioneer',
    chamber: 'House',
    status: 'Former',
    initials: 'MP',
    term: '',
    class: ''
  }
]
