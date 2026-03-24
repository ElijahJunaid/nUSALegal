import { defineEventHandler, createError } from 'h3'
import { validateApiAccess } from '../utils/validateApiAccess'
import { dError } from '../utils/debug'
import {
  caseStatistics,
  topCharges,
  caseOutcomes,
  departmentStats,
  commonDefenses,
  sentencingTrends,
  topProsecutors,
  topDefense,
  topJudges,
  mostActiveDepts
} from '../data/statistics-data'

export default defineEventHandler(async event => {
  validateApiAccess(event, 'statistics')

  try {
    return {
      caseStats: caseStatistics,
      topCharges,
      caseOutcomes,
      departmentStats,
      commonDefenses,
      sentencingTrends,
      topProsecutors,
      topDefense,
      topJudges,
      mostActiveDepts
    }
  } catch (error) {
    dError('Error fetching statistics:', error)
    throw createError({
      status: 500,
      statusText: 'Failed to fetch statistics'
    })
  }
})
