import { congressBills } from '../../bills/congress'
import { cityCouncilBills } from '../../bills/city-council'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const format = (query.format as string) || 'json'
  
  try {
    // Combinar todos os bills e ordenar por número
    const allBills = [...congressBills, ...cityCouncilBills]
      .sort((a, b) => a.number.localeCompare(b.number))
      .map((bill, index) => ({
        id: `bill-${index}`,
        number: bill.number,
        type: bill.type,
        category: bill.category,
        description: bill.description,
        pdfPath: bill.pdfPath || ''
      }))
    
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
      
      const csv = [
        headers.join(','),
        ...rows.map(row => row.join(','))
      ].join('\n')
      
      setHeader(event, 'Content-Type', 'text/csv')
      setHeader(event, 'Content-Disposition', 'attachment; filename="bills.csv"')
      return csv
    }

    setHeader(event, 'Content-Type', 'application/json')
    setHeader(event, 'Content-Disposition', 'attachment; filename="bills.json"')
    return bills
  } catch (error) {
    console.error('Export error:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to export bills'
    })
  }
})
