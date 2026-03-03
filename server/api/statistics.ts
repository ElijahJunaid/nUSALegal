import { defineEventHandler, createError } from 'h3'
import { validateApiAccess } from '../utils/validateApiAccess'
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

export default defineEventHandler(async (event) => {
  validateApiAccess(event, "statistics");

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
    console.error("Error fetching statistics:", error);
    throw createError({
      status: 500,
      statusText: "Failed to fetch statistics",
    });
  }
});
