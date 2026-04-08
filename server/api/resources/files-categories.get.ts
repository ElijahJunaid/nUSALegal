import { defineEventHandler, createError } from 'h3'
import { files } from '../../data/files'

export default defineEventHandler(async () => {
  try {
    // Get unique categories from files
    const categories = [...new Set(files.map(file => file.category))]

    // Group files by category
    const filesByCategory = categories.reduce((acc, category) => {
      acc[category] = files.filter(file => file.category === category)
      return acc
    }, {})

    return {
      success: true,
      data: {
        categories,
        filesByCategory,
        totalFiles: files.length
      }
    }
  } catch (error) {
    console.error('Files Categories API error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch file categories'
    })
  }
})
