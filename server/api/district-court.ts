import { defineEventHandler, createError } from 'h3'
import { validateApiAccess } from '../utils/validateApiAccess'
import { districtCourtCases } from '../data/district-court-cases'

export default defineEventHandler(async (event) => {
  validateApiAccess(event, "district-court");

  try {
    return districtCourtCases
  } catch (error) {
    console.error("Error fetching district court cases:", error);
    throw createError({
      status: 500,
      statusText: "Failed to fetch district court cases",
    });
  }
});