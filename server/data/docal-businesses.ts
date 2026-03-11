export interface Business {
  name: string
  ownerUsername: string
  ownerDiscord: string
  representativeUsername: string
  representativeDiscord: string
  discord: string
  group: string
  sector: string
  ownership: string
  issuingAuthority: string
  issuingDate: string
  expirationDate: string
  status: 'Active' | 'Pending' | 'Expired' | 'Revoked' | 'Special'
}

export const docalBusinesses: Business[] = [
  {
    name: 'NUSFL',
    ownerUsername: '',
    ownerDiscord: '',
    representativeUsername: '',
    representativeDiscord: '',
    discord: '[https://discord.gg/YAut4njDm](https://discord.gg/YAut4njDm "smartCard-inline")',
    group: '',
    sector: 'Entertainment',
    ownership: 'Sole Proprietorship',
    issuingAuthority: 'iTeslaL',
    issuingDate: '01/14/2026',
    expirationDate: '03/16/2026',
    status: 'Pending'
  },
  {
    name: 'Stars and Stripes',
    ownerUsername: '',
    ownerDiscord: '',
    representativeUsername: '',
    representativeDiscord: '',
    discord: '[https://discord.gg/wD5YhjBCjP](https://discord.gg/wD5YhjBCjP "smartCard-inline")',
    group:
      '[https://www.roblox.com/groups/35203280/USA-Stars-and-Stripes#!/about](https://www.roblox.com/groups/35203280/USA-Stars-and-Stripes#!/about "smartCard-inline")',
    sector: 'News and Media',
    ownership: 'Sole Proprietorship',
    issuingAuthority: 'iTeslaL',
    issuingDate: '01/12/2026',
    expirationDate: '03/12/2026',
    status: 'Active'
  },
  {
    name: 'Defense Media',
    ownerUsername: '',
    ownerDiscord: '',
    representativeUsername: '',
    representativeDiscord: '',
    discord: '[https://discord.gg/W5xXep3nj7](https://discord.gg/W5xXep3nj7 "smartCard-inline")',
    group: 'N/A',
    sector: 'News Media',
    ownership: 'Sole Proprietorship',
    issuingAuthority: 'iTeslaL',
    issuingDate: '01/12/2026',
    expirationDate: '03/12/2026',
    status: 'Active'
  },
  {
    name: 'NBN Corporation',
    ownerUsername: '',
    ownerDiscord: '',
    representativeUsername: '',
    representativeDiscord: '',
    discord: '[https://discord.gg/aWAS42wQCE](https://discord.gg/aWAS42wQCE "smartCard-inline")',
    group: 'N/A',
    sector: 'News Media',
    ownership: 'Sole Proprietorship',
    issuingAuthority: 'iTeslaL',
    issuingDate: '01/12/2026',
    expirationDate: '03/13/2026',
    status: 'Active'
  },
  {
    name: 'Diamond Security Firm',
    ownerUsername: '',
    ownerDiscord: '',
    representativeUsername: '',
    representativeDiscord: '',
    discord: '[https://discord.gg/cceXVHbNmt](https://discord.gg/cceXVHbNmt "smartCard-inline")',
    group:
      '[https://www.roblox.com/communities/2858260/Diamond-Security-Firm#!/about](https://www.roblox.com/communities/2858260/Diamond-Security-Firm#!/about "smartCard-inline")',
    sector: 'Private Security',
    ownership: 'Sole Proprietorship',
    issuingAuthority: 'iTeslaL',
    issuingDate: '01/12/2026',
    expirationDate: '03/13/2026',
    status: 'Active'
  },
  {
    name: 'The Roosevelt',
    ownerUsername: '',
    ownerDiscord: '',
    representativeUsername: '',
    representativeDiscord: '',
    discord: '[https://discord.gg/MBjDXxzvsn](https://discord.gg/MBjDXxzvsn "smartCard-inline")',
    group:
      '[https://www.roblox.com/communities/185781330/The-Roosevelt-Restaurant#!/about](https://www.roblox.com/communities/185781330/The-Roosevelt-Restaurant#!/about "smartCard-inline")',
    sector: 'Hospitality',
    ownership: 'Sole Proprietorship',
    issuingAuthority: 'iTeslaL',
    issuingDate: '01/12/2026',
    expirationDate: '03/14/2026',
    status: 'Active'
  },
  {
    name: 'Frontline Talks',
    ownerUsername: '',
    ownerDiscord: '',
    representativeUsername: '',
    representativeDiscord: '',
    discord: '[https://discord.gg/2Mju3DG3](https://discord.gg/2Mju3DG3 "‌")',
    group: 'N/A',
    sector: 'News and Media',
    ownership: 'Sole Proprietorship',
    issuingAuthority: 'iTeslaL',
    issuingDate: '01/13/2026',
    expirationDate: '03/15/2026',
    status: 'Active'
  },
  {
    name: 'nUSA Satellite Public Affairs Network',
    ownerUsername: '',
    ownerDiscord: '',
    representativeUsername: '',
    representativeDiscord: '',
    discord: '[https://discord.gg/aWAS42wQCE](https://discord.gg/aWAS42wQCE "smartCard-inline")',
    group: 'N/A',
    sector: 'News and Media',
    ownership: 'Sole Proprietorship',
    issuingAuthority: 'iTeslaL',
    issuingDate: '01/13/2026',
    expirationDate: '03/15/2026',
    status: 'Active'
  },
  {
    name: 'United States Public Affairs Network',
    ownerUsername: '',
    ownerDiscord: '',
    representativeUsername: '',
    representativeDiscord: '',
    discord: '[https://discord.gg/YarMscqe36](https://discord.gg/YarMscqe36 "smartCard-inline")',
    group: 'N/A',
    sector: 'News Media',
    ownership: 'Sole Proprietorship',
    issuingAuthority: 'iTeslaL',
    issuingDate: '01/14/2026',
    expirationDate: '03/16/2026',
    status: 'Active'
  },
  {
    name: 'The Intercept',
    ownerUsername: '',
    ownerDiscord: '',
    representativeUsername: '',
    representativeDiscord: '',
    discord: '[https://discord.com/invite/6cFTmmBBu](https://discord.com/invite/6cFTmmBBu "‌")',
    group: 'N/A',
    sector: 'News Media',
    ownership: 'Corporation',
    issuingAuthority: 'PrinceAmir_402',
    issuingDate: '2/18/2026',
    expirationDate: '4/20/2026',
    status: 'Active'
  },
  {
    name: '`The Arlington Times`',
    ownerUsername: '',
    ownerDiscord: '',
    representativeUsername: '',
    representativeDiscord: '',
    discord: '`https://discord.gg/jnYwPX5Kut`',
    group: 'N/A',
    sector: '`News & Media`',
    ownership: '`Sole Proprietorship`',
    issuingAuthority: 'PrinceAmir_402',
    issuingDate: '2/27/26',
    expirationDate: '4/29/26',
    status: 'Active'
  },
  {
    name: 'Arlington First',
    ownerUsername: '',
    ownerDiscord: '',
    representativeUsername: '',
    representativeDiscord: '',
    discord: '`https://discord.gg/DhztHmDN`',
    group: 'N/A',
    sector: 'Media',
    ownership: 'Sole Proprietorship',
    issuingAuthority: 'PrinceAmir_402',
    issuingDate: '03/05/2026',
    expirationDate: '05/07/2026',
    status: 'Active'
  },
  {
    name: '`Carter Communications Corporation`',
    ownerUsername: '',
    ownerDiscord: '',
    representativeUsername: '',
    representativeDiscord: '',
    discord: '`https://discord.gg/rbFdRwNXZm`',
    group: 'N/A',
    sector: '`News Media`',
    ownership: '`Sole Proprietorship`',
    issuingAuthority: 'PrinceAmir_402',
    issuingDate: '03/05/2026',
    expirationDate: '05/07/2026',
    status: 'Active'
  },
  {
    name: '`Vinick Enterprises, LLC`',
    ownerUsername: '',
    ownerDiscord: '',
    representativeUsername: '',
    representativeDiscord: '',
    discord: '[https://discord.gg/2DehzH2gb2](https://discord.gg/2DehzH2gb2 "smartCard-inline")',
    group: 'N/A',
    sector: '`Private Consulting`',
    ownership: 'Sole Proprietorship',
    issuingAuthority: 'ElijahJunaid',
    issuingDate: '03/08/2026',
    expirationDate: '05/10/2026',
    status: 'Active'
  },
  {
    name: '`Venture Society`',
    ownerUsername: '',
    ownerDiscord: '',
    representativeUsername: '',
    representativeDiscord: '',
    discord: '`https://discord.gg/7AxnGn7x2Z`',
    group: 'N/A',
    sector: '`News Media`',
    ownership: '`Sole Proprietorship`',
    issuingAuthority: 'ElijahJunaid',
    issuingDate: '03/10/2026',
    expirationDate: '05/12/2026',
    status: 'Active'
  },
  {
    name: '`The National Chronicle`',
    ownerUsername: '',
    ownerDiscord: '',
    representativeUsername: '',
    representativeDiscord: '',
    discord: '`https://discord.gg/pQbN5dK7`',
    group: 'N/A',
    sector: '`News Media`',
    ownership: '`Sole Proprietorship`',
    issuingAuthority: 'ElijahJunaid',
    issuingDate: '03/10/2026',
    expirationDate: '05/12/2026',
    status: 'Active'
  },
  {
    name: 'Fedoraa Corporation',
    ownerUsername: '',
    ownerDiscord: '',
    representativeUsername: '',
    representativeDiscord: '',
    discord: '[https://discord.gg/SBKH3PzX](https://discord.gg/SBKH3PzX "smartCard-inline")',
    group:
      '[https://www.roblox.com/groups/3957193/Fedoraa#!/](https://www.roblox.com/groups/3957193/Fedoraa#!/ "smartCard-inline")',
    sector: '',
    ownership: '',
    issuingAuthority: '_LuisAntonioSantiago_',
    issuingDate: '_11/01/2023_',
    expirationDate: '_NEVER_',
    status: 'Special'
  },
  {
    name: '`The Foley Frontlines`',
    ownerUsername: '',
    ownerDiscord: '',
    representativeUsername: '',
    representativeDiscord: '',
    discord: '`https://discord.gg/gnbSJyGunG`',
    group: 'N/A',
    sector: '`News Media`',
    ownership: '`Sole Proprietorship`',
    issuingAuthority: 'PrinceAmir_402',
    issuingDate: '03/01/2026',
    expirationDate: '05/03/2026',
    status: 'Revoked'
  }
]
