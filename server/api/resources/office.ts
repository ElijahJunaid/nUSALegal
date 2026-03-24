import { offices } from '../../data/offices'
import { defineEventHandler, createError } from 'h3'
import { validateApiAccess } from '../../utils/validateApiAccess'
import { dError } from '../../utils/debug'

interface Office {
  name: string
  description: string
  category: string
}

interface OfficeEntry {
  title: string
  description: string
}

interface OfficeGroup {
  label: string
  data: OfficeEntry[]
}

export default defineEventHandler(async event => {
  validateApiAccess(event, 'resources/office')

  try {
    const grouped = offices.reduce((acc: OfficeGroup[], office: Office) => {
      const existing = acc.find((g: OfficeGroup) => g.label === office.category)
      if (existing) {
        existing.data.push({
          title: office.name,
          description: office.description
        })
      } else {
        acc.push({
          label: office.category,
          data: [
            {
              title: office.name,
              description: office.description
            }
          ]
        })
      }
      return acc
    }, [])

    return grouped
  } catch (error) {
    dError('Error fetching offices:', error)
    throw createError({
      status: 500,
      statusText: 'Failed to fetch offices'
    })
  }
})
