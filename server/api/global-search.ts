import { defineEventHandler, createError, getQuery } from 'h3'
import { validateApiAccess } from '../utils/validateApiAccess'
import { federalLaws } from '../data/laws'
import { frcpRules } from '../data/federal-rules-frcp'
import { frcmpRules } from '../data/federal-rules-frcmp'
import { constitutionArticles, constitutionAmendments } from '../data/constitution'
import { executiveOrders } from '../data/executive-orders'
import { municipalLaws } from '../data/municipal-laws'
import { definitions } from '../data/definitions'
import { districtCourtCases } from '../data/district-court-cases'

export default defineEventHandler(async (event) => {
  validateApiAccess(event, "global-search");

  try {
    const query = getQuery(event)
    const searchTerm = (query.q as string || '').toLowerCase().trim()
    const category = query.category as string || 'all'

    if (!searchTerm || searchTerm.length < 2) {
      return []
    }

    const results: any[] = []

    if (category === 'all' || category === 'laws') {
      federalLaws.forEach((law: any) => {
        const matchTitle = law.title?.toLowerCase().includes(searchTerm)
        const matchCode = law.uscode?.toLowerCase().includes(searchTerm)
        const matchDescription = law.description?.toLowerCase().includes(searchTerm)
        const matchCategory = law.category?.toLowerCase().includes(searchTerm)
        
        if (matchTitle || matchCode || matchDescription || matchCategory) {
          results.push({
            title: law.title,
            subtitle: law.uscode,
            excerpt: law.description?.replace(/<br>/g, ' ').substring(0, 150) + '...',
            category: 'Federal Laws',
            categoryColor: '#ef4444',
            url: '/laws'
          })
        }
      })

      municipalLaws.forEach((law: any) => {
        const matchTitle = law.title?.toLowerCase().includes(searchTerm)
        const matchCode = law.code?.toLowerCase().includes(searchTerm)
        const matchDescription = law.description?.toLowerCase().includes(searchTerm)
        const matchCategory = law.category?.toLowerCase().includes(searchTerm)
        
        if (matchTitle || matchCode || matchDescription || matchCategory) {
          results.push({
            title: law.title,
            subtitle: law.code,
            excerpt: law.description?.replace(/<br>/g, ' ').substring(0, 150) + '...',
            category: 'Municipal Laws',
            categoryColor: '#f59e0b',
            url: '/laws'
          })
        }
      })
    }

    if (category === 'all' || category === 'rules') {
      frcpRules.forEach((rule: any) => {
        const matchNumber = rule.number?.toLowerCase().includes(searchTerm)
        const matchTitle = rule.title?.toLowerCase().includes(searchTerm)
        const matchDescription = rule.description?.toLowerCase().includes(searchTerm)
        
        if (matchNumber || matchTitle || matchDescription) {
          results.push({
            title: rule.number,
            subtitle: rule.title,
            excerpt: rule.description?.substring(0, 150) + '...',
            category: 'FRCP',
            categoryColor: '#3b82f6',
            url: '/frcp-frcmp'
          })
        }
      })
    }

    if (category === 'all' || category === 'rules') {
      frcmpRules.forEach((rule: any) => {
        const matchNumber = rule.number?.toLowerCase().includes(searchTerm)
        const matchTitle = rule.title?.toLowerCase().includes(searchTerm)
        const matchDescription = rule.description?.toLowerCase().includes(searchTerm)
        
        if (matchNumber || matchTitle || matchDescription) {
          results.push({
            title: rule.number,
            subtitle: rule.title,
            excerpt: rule.description?.substring(0, 150) + '...',
            category: 'FRCMP',
            categoryColor: '#8b5cf6',
            url: '/frcp-frcmp'
          })
        }
      })
    }

    if (category === 'all' || category === 'constitution') {
      constitutionArticles.forEach((article: any) => {
        const matchTitle = article.title?.toLowerCase().includes(searchTerm)
        const matchSummary = article.summary?.toLowerCase().includes(searchTerm)
        
        if (matchTitle || matchSummary) {
          results.push({
            title: article.title,
            subtitle: 'Constitution',
            excerpt: article.summary?.substring(0, 150) + '...',
            category: 'Constitution',
            categoryColor: '#3b82f6',
            url: '/constitution'
          })
        }
      })

      constitutionAmendments.forEach((amendment: any) => {
        const matchTitle = amendment.title?.toLowerCase().includes(searchTerm)
        const matchContent = amendment.content?.toLowerCase().includes(searchTerm)
        const matchSummary = amendment.summary?.toLowerCase().includes(searchTerm)
        
        if (matchTitle || matchContent || matchSummary) {
          results.push({
            title: amendment.title,
            subtitle: 'Amendment',
            excerpt: amendment.summary?.substring(0, 150) + '...',
            category: 'Constitution',
            categoryColor: '#3b82f6',
            url: '/constitution'
          })
        }
      })
    }

    if (category === 'all' || category === 'bills') {
      executiveOrders.forEach((order: any) => {
        const matchNumber = order.number?.toLowerCase().includes(searchTerm)
        const matchTitle = order.title?.toLowerCase().includes(searchTerm)
        const matchDescription = order.description?.toLowerCase().includes(searchTerm)
        
        if (matchNumber || matchTitle || matchDescription) {
          results.push({
            title: order.title,
            subtitle: order.number,
            excerpt: order.description?.substring(0, 150) + '...',
            category: 'Executive Orders',
            categoryColor: '#10b981',
            url: '/bills'
          })
        }
      })
    }

    if (category === 'all' || category === 'courts') {
      districtCourtCases.forEach((courtCase: any) => {
        const matchTitle = courtCase.title?.toLowerCase().includes(searchTerm)
        const matchCaseNumber = courtCase.caseNumber?.toLowerCase().includes(searchTerm)
        const matchCharge = courtCase.charge?.toLowerCase().includes(searchTerm)
        const matchJudge = courtCase.judge?.toLowerCase().includes(searchTerm)
        const matchSummary = courtCase.summary?.toLowerCase().includes(searchTerm)
        
        if (matchTitle || matchCaseNumber || matchCharge || matchJudge || matchSummary) {
          results.push({
            title: courtCase.title,
            subtitle: courtCase.caseNumber + ' - ' + courtCase.charge,
            excerpt: courtCase.summary?.substring(0, 150) + '...',
            category: 'District Court',
            categoryColor: '#8b5cf6',
            url: '/courts'
          })
        }
      })
    }

    if (category === 'all' || category === 'resources') {
      definitions.forEach((def: any) => {
        const matchTitle = def.title?.toLowerCase().includes(searchTerm)
        const matchDescription = def.description?.toLowerCase().includes(searchTerm)
        
        if (matchTitle || matchDescription) {
          results.push({
            title: def.title,
            subtitle: 'Legal Definition',
            excerpt: def.description?.substring(0, 150) + '...',
            category: 'Resources',
            categoryColor: '#ec4899',
            url: '/resources'
          })
        }
      })
    }

    return results.slice(0, 50)
  } catch (error) {
    console.error("Error in global search:", error);
    throw createError({
      status: 500,
      statusText: "Failed to perform search",
    });
  }
});