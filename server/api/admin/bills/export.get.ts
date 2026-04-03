import { congressBills } from '../../../data/congress-bills'
import { cityCouncilBills } from '../../bills/city-council'
import { defineEventHandler, getQuery, createError, setHeader } from 'h3'
import { dError } from '../../../utils/debug'

export default defineEventHandler(async event => {
  const query = getQuery(event)
  const format = (query.format as string) || 'json'

  try {
    const allBills = [...congressBills, ...cityCouncilBills]
      .sort((a, b) => {
        const aNumber = 'number' in a ? a.number : a.billNumber
        const bNumber = 'number' in b ? b.number : b.billNumber
        return aNumber.localeCompare(bNumber)
      })
      .map((bill, index) => {
        const billNumber = 'number' in bill ? bill.number : bill.billNumber
        return {
          id: `bill-${index}`,
          number: billNumber,
          type: bill.type,
          category: bill.category,
          description: bill.description,
          pdfPath: bill.pdfPath || ''
        }
      })

    const bills = allBills

    if (format === 'csv') {
      const headers = ['ID', 'Number', 'Type', 'Category', 'Description', 'PDF Path']
      const rows = bills.map(b => [
        b.id,
        `"${b.number}"`,
        b.type,
        b.category,
        `"${(b.description || '').replace(/"/g, '""')}"`,
        b.pdfPath || ''
      ])

      const csv = [headers.join(','), ...rows.map(row => row.join(','))].join('\n')

      setHeader(event, 'Content-Type', 'text/csv')
      setHeader(event, 'Content-Disposition', 'attachment; filename="bills.csv"')
      return csv
    }

    setHeader(event, 'Content-Type', 'application/json')
    setHeader(event, 'Content-Disposition', 'attachment; filename="bills.json"')
    return bills
  } catch (error) {
    dError('Export error:', error)
    throw createError({
      status: 500,
      statusText: 'Failed to export bills'
    })
  }
})
