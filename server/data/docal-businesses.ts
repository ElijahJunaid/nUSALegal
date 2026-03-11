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

export const docalBusinesses: Business[] = []
