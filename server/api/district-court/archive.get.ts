import { defineEventHandler, createError, getQuery } from 'h3'
import { districtCourtArchive } from '../../data/court-procedures'

export default defineEventHandler(async event => {
  try {
    // Get query parameters for filtering and pagination
    const query = getQuery(event)
    const page = parseInt((query.page as string) || '1') || 1
    const limit = parseInt((query.limit as string) || '20') || 20
    const search = (query.search as string) || ''
    const caseType = (query.caseType as string) || ''
    const dateFrom = (query.dateFrom as string) || ''
    const dateTo = (query.dateTo as string) || ''

    // Filter cases based on query parameters
    let filteredCases = [...districtCourtArchive]

    // Search filter
    if (search) {
      const searchLower = search.toLowerCase()
      filteredCases = filteredCases.filter(
        case_ =>
          case_.title.toLowerCase().includes(searchLower) ||
          case_.docketNumber.toLowerCase().includes(searchLower) ||
          (case_.description && case_.description.toLowerCase().includes(searchLower))
      )
    }

    // Case type filter
    if (caseType) {
      filteredCases = filteredCases.filter(case_ => case_.caseType === caseType)
    }

    // Date range filter
    if (dateFrom) {
      filteredCases = filteredCases.filter(case_ => case_.date >= dateFrom)
    }
    if (dateTo) {
      filteredCases = filteredCases.filter(case_ => case_.date <= dateTo)
    }

    // Sort by date (newest first)
    filteredCases.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    // Pagination
    const total = filteredCases.length
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedCases = filteredCases.slice(startIndex, endIndex)

    // Get unique case types for filtering
    const caseTypes = [...new Set(districtCourtArchive.map(case_ => case_.caseType))]

    return {
      success: true,
      data: {
        cases: paginatedCases,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
          hasNext: endIndex < total,
          hasPrev: page > 1
        },
        filters: {
          caseTypes,
          search,
          caseType,
          dateFrom,
          dateTo
        }
      }
    }
  } catch (error) {
    console.error('District Court Archive API error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch district court archive data'
    })
  }
})
