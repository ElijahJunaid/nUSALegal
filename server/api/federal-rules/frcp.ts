import { frcpRules } from '../../data/federal-rules-frcp'
import { defineEventHandler, createError } from 'h3'
import { validateApiAccess } from '../../utils/validateApiAccess'

interface FrcpRule {
  number: string
  type: string
  titleGroup: string
  title: string
  description: string
}

interface GroupedRuleEntry {
  title: string
  subtitle: string
  content: string
  excerp: string
}

export default defineEventHandler(async event => {
  validateApiAccess(event, 'federal-rules/frcp')

  try {
    const groupedRules: Record<string, GroupedRuleEntry[]> = {}

    frcpRules.forEach((rule: FrcpRule) => {
      const group = rule.titleGroup || 'Other'
      if (!groupedRules[group]) {
        groupedRules[group] = []
      }
      groupedRules[group].push({
        title: rule.number,
        subtitle: rule.title,
        content: rule.description,
        excerp: rule.description.substring(0, 200) + '...'
      })
    })

    return Object.keys(groupedRules).map(label => ({
      label,
      data: groupedRules[label]
    }))
  } catch (error) {
    console.error('Error fetching FRCP rules:', error)
    throw createError({
      status: 500,
      statusText: 'Failed to fetch FRCP rules'
    })
  }
})
