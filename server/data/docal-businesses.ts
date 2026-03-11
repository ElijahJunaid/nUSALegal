export interface Business {
  name: string
  owner: string
  type: string
  state: string
  status: string
  description: string
}

export const docalBusinesses: Business[] = [
  {
    name: 'Example Co.',
    owner: 'john_doe',
    type: 'LLC',
    state: 'CA',
    status: 'Active',
    description: 'A sample business registered with nUSA DOCAL.'
  },
  {
    name: 'Sample Corp',
    owner: 'jane_smith',
    type: 'Corporation',
    state: 'TX',
    status: 'Active',
    description: 'Another example business entry.'
  }
]
