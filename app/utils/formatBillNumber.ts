// @ts-ignore - Nuxt plugin import
import { dLog } from '~/plugins/debug-logger.client'

export function formatBillNumber(
  num: string,
  publicLaw?: string,
  billType?: string,
  billNumber?: string,
  category?: string
): string {
  // Debug log to see what we're getting
  dLog(
    `formatBillNumber DEBUG: num="${num}", publicLaw="${publicLaw}", billType="${billType}", billNumber="${billNumber}", category="${category}"`
  )

  // Handle format like "Public Law 92-4 | Court Ethics Act (H.R. 32)"
  if (num.includes('Public Law') && num.includes('|')) {
    const parts = num.split('|')
    if (parts.length >= 2) {
      const plPart = parts[0].trim()
      const plMatch = plPart.match(/Public Law\s*(.+)/)
      const plNumber = plMatch ? plMatch[1] : plPart

      const titleAndBill = parts[1].trim()
      const titleMatch = titleAndBill.match(/^(.+?)\s*\(/)
      const title = titleMatch ? titleMatch[1].trim() : titleAndBill
      const billMatch = titleAndBill.match(/\(([^)]+)\)$/)
      const bill = billMatch ? billMatch[1] : ''

      return `PL ${plNumber} | ${title} (${bill})`
    }
  }

  // Handle the specific problematic format first
  if (num.match(/^\d+-\d+\s*\|/)) {
    // Format like "107-4 | Grand Jury Recomposition Act (H.R. 5)"
    const parts = num.split('|')
    if (parts.length >= 2) {
      const titleAndBill = parts[1].trim()
      const titleMatch = titleAndBill.match(/^(.+?)\s*\(/)
      const title = titleMatch ? titleMatch[1].trim() : titleAndBill
      const billMatch = titleAndBill.match(/\(([^)]+)\)$/)
      const bill = billMatch ? billMatch[1] : ''
      return `Congress | ${title} (${bill})`
    }
  }

  // Handle bills where billNumber is the same as num (no proper bill number)
  if (billNumber && billNumber === num && billType && category === 'congress') {
    const billTypeFormatted = formatBillTypeCode(billType)
    // Check if num looks like a title (no bill number pattern)
    if (
      !num.match(
        /^(S\.|H\.R\.|H\.J\.Res\.|S\.J\.Res\.|H\.Con\.Res\.|S\.Con\.Res\.|H\.Res\.|S\.Res\.|Public Law|\d+-\d+)/
      )
    ) {
      // num is actually a title, so use it directly
      return `Congress | ${num} (${billTypeFormatted})`
    }
    return `Congress | ${num} (${billTypeFormatted})`
  }

  // Handle bills with no proper bill number in parentheses
  if (billType && !billNumber && category === 'congress') {
    const billTypeFormatted = formatBillTypeCode(billType)

    // Check if num looks like a title (no bill number pattern)
    if (
      !num.match(
        /^(S\.|H\.R\.|H\.J\.Res\.|S\.J\.Res\.|H\.Con\.Res\.|S\.Con\.Res\.|H\.Res\.|S\.Res\.|Public Law|\d+-\d+)/
      )
    ) {
      // num is actually a title, so use it directly
      return `Congress | ${num} (${billTypeFormatted})`
    }

    return `Congress | ${num} (${billTypeFormatted})`
  }

  // Extract the title once to use consistently
  const billTitle = extractBillTitle(num)

  // Debug: log what we're getting
  dLog(`formatBillNumber: num="${num}", billTitle="${billTitle}", billNumber="${billNumber}"`)

  // If we have Public Law info, format as "PL XXX-XX | Title (Bill Type Bill Number)"
  if (publicLaw && billType && billNumber) {
    const billTypeFormatted = formatBillTypeCode(billType)
    // Extract just the number from billNumber
    const justNumber = billNumber.replace(/^[A-Za-z.]+\s*/, '')
    return `PL ${publicLaw} | ${billTitle} (${billTypeFormatted} ${justNumber})`
  }

  // If no Public Law, log this and format as "Session | Title (Bill Type Bill Number)"
  if (billType && billNumber) {
    // Log that this bill has no public law
    dLog(`Bill ${num} has no public law number`)

    const billTypeFormatted = formatBillTypeCode(billType)
    // For DC bills, use current year or default
    const prefix = category === 'city-council' ? 'DC' : 'Congress'
    // Extract just the number from billNumber
    const justNumber = billNumber.replace(/^[A-Za-z.]+\s*/, '')
    return `${prefix} | ${billTitle} (${billTypeFormatted} ${justNumber})`
  }

  // Fallback for bills without billType/billNumber - try to extract from num
  if (category === 'congress') {
    const extractedBillNumber = extractBillNumber(num)
    if (extractedBillNumber !== num) {
      // We successfully extracted a bill number
      const justNumber = extractedBillNumber.replace(/^[A-Za-z.]+\s*/, '')
      const billTypeFormatted = formatBillTypeCode(
        extractedBillNumber.match(/^[A-Za-z.]+/)?.[0] || 's'
      )
      return `Congress | ${billTitle} (${billTypeFormatted} ${justNumber})`
    }
  }

  // Final fallback - just return the title
  if (category === 'congress') {
    return `Congress | ${billTitle}`
  }

  // Handle existing Public Law formatting
  let formatted = num
    .replace(/^Public Law\s+/i, 'PL ')
    .replace(/\| Public Law\s+/gi, '| PL ')
    .replace(/^(\d{2,3}-\d+)\s*\|/, 'PL $1 |')

  // Format Congress bills with proper numbering
  formatted = formatted
    .replace(/^S\.\s*(\d+):?\s*(.+)/i, (match, number, title) => {
      return `S. ${number}: ${title.trim()}`
    })
    .replace(/^H\.R\.\s*(\d+):?\s*(.+)/i, (match, number, title) => {
      return `H.R. ${number}: ${title.trim()}`
    })
    .replace(/^H\.J\.Res\.\s*(\d+):?\s*(.+)/i, (match, number, title) => {
      return `H.J.Res. ${number}: ${title.trim()}`
    })
    .replace(/^S\.J\.Res\.\s*(\d+):?\s*(.+)/i, (match, number, title) => {
      return `S.J.Res. ${number}: ${title.trim()}`
    })
    .replace(/^H\.Con\.Res\.\s*(\d+):?\s*(.+)/i, (match, number, title) => {
      return `H.Con.Res. ${number}: ${title.trim()}`
    })
    .replace(/^S\.Con\.Res\.\s*(\d+):?\s*(.+)/i, (match, number, title) => {
      return `S.Con.Res. ${number}: ${title.trim()}`
    })
    .replace(/^H\.Res\.\s*(\d+):?\s*(.+)/i, (match, number, title) => {
      return `H.Res. ${number}: ${title.trim()}`
    })
    .replace(/^S\.Res\.\s*(\d+):?\s*(.+)/i, (match, number, title) => {
      return `S.Res. ${number}: ${title.trim()}`
    })

  return formatted
}

export function formatBillTypeCode(type: string): string {
  const typeMap: Record<string, string> = {
    hr: 'H.R.',
    s: 'S.',
    hjres: 'H.J.Res.',
    sjres: 'S.J.Res.',
    hconres: 'H.Con.Res.',
    sconres: 'S.Con.Res.',
    hres: 'H.Res.',
    sres: 'S.Res.'
  }
  return typeMap[type] || type
}

export function formatBillType(type: string): string {
  const typeMap: Record<string, string> = {
    hr: 'House Bill',
    s: 'Senate Bill',
    hjres: 'House Joint Resolution',
    sjres: 'Senate Joint Resolution',
    hconres: 'House Concurrent Resolution',
    sconres: 'Senate Concurrent Resolution',
    hres: 'House Resolution',
    sres: 'Senate Resolution',
    act: 'Act',
    ordinance: 'Ordinance',
    resolution: 'Resolution'
  }
  return typeMap[type] || 'Bill'
}

export function extractBillNumber(number: string): string {
  // Extract just the bill number part (e.g., "S. 1" from "S. 1: Title")
  const match = number.match(
    /^(S\.|H\.R\.|H\.J\.Res\.|S\.J\.Res\.|H\.Con\.Res\.|S\.Con\.Res\.|H\.Res\.|S\.Res\.)\s*(\d+)/
  )
  if (match) {
    return `${match[1]} ${match[2]}`
  }

  // Handle Public Law format
  const plMatch = number.match(/^(PL\s*\d{2,3}-\d+)/)
  if (plMatch) {
    return plMatch[1]
  }

  // Handle DC bills
  const dcMatch = number.match(/^(Ordinance No\. \d+|Act|Resolution)/)
  if (dcMatch) {
    return dcMatch[1]
  }

  return number
}

export function extractBillTitle(number: string): string {
  // Extract just the title part (e.g., "Title" from "S. 1: Title")
  const match = number.match(
    /^(S\.|H\.R\.|H\.J\.Res\.|S\.J\.Res\.|H\.Con\.Res\.|S\.Con\.Res\.|H\.Res\.|S\.Res\.)\s*\d+(?::\s*(.+))?/
  )
  if (match && match[2]) {
    return match[2].trim()
  }

  // Handle Public Law format
  const plMatch = number.match(/^(PL\s*\d{2,3}-\d+)\s*\|\s*(.+?)\s*\(/)
  if (plMatch) {
    return plMatch[2].trim()
  }

  // Handle format like "107-4 | Grand Jury Recomposition Act (H.R. 5)"
  const sessionMatch = number.match(/^\d+-\d+\s*\|\s*(.+?)\s*\(/)
  if (sessionMatch) {
    return sessionMatch[1].trim()
  }

  // Handle format like "107-4 | Grand Jury Recomposition Act (H.R. 5)" - more permissive
  const permissiveMatch = number.match(/^\d+-\d+\s*\|\s*(.+?)\s*\(/)
  if (permissiveMatch) {
    return permissiveMatch[1].trim()
  }

  // If no match, try to get everything before the last parenthesis
  const lastParenMatch = number.match(/^(.+?)\s*\([^)]+\)$/)
  if (lastParenMatch) {
    return lastParenMatch[1].trim()
  }

  // Final fallback - return everything before the first pipe or parenthesis
  const fallbackMatch = number.match(/^([^|(\n]+)/)
  if (fallbackMatch) {
    return fallbackMatch[1].trim()
  }

  return number
}
