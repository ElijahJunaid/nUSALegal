import { defineEventHandler, createError, getQuery } from 'h3'
import supremeCourtData from '../../data/supreme-court-rulings.js'

export default defineEventHandler(async event => {
  try {
    // Get query parameters for filtering and pagination
    const query = getQuery(event)
    const page = parseInt((query.page as string) || '1') || 1
    const limit = parseInt((query.limit as string) || '20') || 20
    const search = (query.search as string) || ''
    const term = (query.term as string) || ''
    const dateFrom = (query.dateFrom as string) || ''
    const dateTo = (query.dateTo as string) || ''

    // Combine all ruling data from different sources
    const allRulings = [
      ...(supremeCourtData.supremeCourtRulingsTerms2To10 || []),
      ...(supremeCourtData.supremeCourtRulingsTerms9To14 || []),
      ...(supremeCourtData.supremeCourtRulingsTerms15To18 || [])
    ]

    // Filter cases based on query parameters
    let filteredRulings = [...allRulings]

    // Search filter
    if (search) {
      const searchLower = search.toLowerCase()
      filteredRulings = filteredRulings.filter(
        ruling =>
          ruling.title.toLowerCase().includes(searchLower) ||
          ruling.docketNumber.toLowerCase().includes(searchLower) ||
          (ruling.description && ruling.description.toLowerCase().includes(searchLower))
      )
    }

    // Term filter
    if (term) {
      const termNumber = parseInt(term)
      filteredRulings = filteredRulings.filter(ruling => ruling.term === termNumber)
    }

    // Date range filter
    if (dateFrom) {
      filteredRulings = filteredRulings.filter(ruling => ruling.date >= dateFrom)
    }
    if (dateTo) {
      filteredRulings = filteredRulings.filter(ruling => ruling.date <= dateTo)
    }

    // Sort by date (newest first)
    filteredRulings.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    // Pagination
    const total = filteredRulings.length
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedRulings = filteredRulings.slice(startIndex, endIndex)

    // Get unique terms for filtering
    const terms = [...new Set(allRulings.map(ruling => ruling.term))].sort((a, b) => a - b)

    return {
      success: true,
      data: {
        rulings: paginatedRulings,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
          hasNext: endIndex < total,
          hasPrev: page > 1
        },
        filters: {
          terms,
          search,
          term,
          dateFrom,
          dateTo
        }
      }
    }
  } catch (error) {
    console.error('Supreme Court Rulings API error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch Supreme Court rulings data'
    })
  }
})
