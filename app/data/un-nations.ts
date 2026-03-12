export interface UNNation {
  numericCode: number
  code: string
  name: string
  flag: string
  status: 'Member' | 'Observer' | 'Allied'
  owner: string
  leader: string
  capital?: string
  joined?: string
}

export const unNations: UNNation[] = [
  {
    numericCode: 840,
    code: 'US',
    name: 'United States',
    flag: '🇺🇸',
    status: 'Member',
    owner: 'Placeholder Owner',
    leader: 'Placeholder Leader',
    capital: 'Washington, D.C.',
    joined: '2024'
  },
  {
    numericCode: 826,
    code: 'GB',
    name: 'United Kingdom',
    flag: '🇬🇧',
    status: 'Member',
    owner: 'Placeholder Owner',
    leader: 'Placeholder Leader',
    capital: 'London',
    joined: '2024'
  },
  {
    numericCode: 250,
    code: 'FR',
    name: 'France',
    flag: '🇫🇷',
    status: 'Member',
    owner: 'Placeholder Owner',
    leader: 'Placeholder Leader',
    capital: 'Paris',
    joined: '2024'
  },
  {
    numericCode: 276,
    code: 'DE',
    name: 'Germany',
    flag: '🇩🇪',
    status: 'Member',
    owner: 'Placeholder Owner',
    leader: 'Placeholder Leader',
    capital: 'Berlin',
    joined: '2024'
  },
  {
    numericCode: 392,
    code: 'JP',
    name: 'Japan',
    flag: '🇯🇵',
    status: 'Member',
    owner: 'Placeholder Owner',
    leader: 'Placeholder Leader',
    capital: 'Tokyo',
    joined: '2024'
  },
  {
    numericCode: 76,
    code: 'BR',
    name: 'Brazil',
    flag: '🇧🇷',
    status: 'Allied',
    owner: 'Placeholder Owner',
    leader: 'Placeholder Leader',
    capital: 'Brasília',
    joined: '2024'
  },
  {
    numericCode: 124,
    code: 'CA',
    name: 'Canada',
    flag: '🇨🇦',
    status: 'Member',
    owner: 'Placeholder Owner',
    leader: 'Placeholder Leader',
    capital: 'Ottawa',
    joined: '2024'
  },
  {
    numericCode: 36,
    code: 'AU',
    name: 'Australia',
    flag: '🇦🇺',
    status: 'Observer',
    owner: 'Placeholder Owner',
    leader: 'Placeholder Leader',
    capital: 'Canberra',
    joined: '2024'
  },
  {
    numericCode: 156,
    code: 'CN',
    name: 'China',
    flag: '🇨🇳',
    status: 'Member',
    owner: 'Placeholder Owner',
    leader: 'Placeholder Leader',
    capital: 'Beijing',
    joined: '2024'
  },
  {
    numericCode: 643,
    code: 'RU',
    name: 'Russia',
    flag: '🇷🇺',
    status: 'Member',
    owner: 'Placeholder Owner',
    leader: 'Placeholder Leader',
    capital: 'Moscow',
    joined: '2024'
  }
]
