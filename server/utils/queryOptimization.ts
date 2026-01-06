

export const billSelectFields = {
  id: true,
  number: true,
  description: true,
  type: true,
  category: true,
  pdfPath: true,
  createdAt: true,
  updatedAt: true
}

export const lawSelectFields = {
  id: true,
  title: true,
  description: true,
  category: true,
  uscode: true,
  year: true,
  createdAt: true,
  updatedAt: true
}

export const definitionSelectFields = {
  id: true,
  title: true,
  description: true,
  category: true
}

export function createSelect<T extends Record<string, boolean>>(
  fields: T,
  includeTimestamps: boolean = false
): T {
  if (includeTimestamps) {
    return fields
  }
  
  const { createdAt, updatedAt, ...rest } = fields
  return rest as T
}

export async function processBatches<T, R>(
  items: T[],
  batchSize: number,
  processor: (batch: T[]) => Promise<R[]>
): Promise<R[]> {
  const results: R[] = []
  
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize)
    const batchResults = await processor(batch)
    results.push(...batchResults)
  }
  
  return results
}

export function createTextSearchWhere(
  searchTerm: string,
  fields: string[]
): any {
  if (!searchTerm || fields.length === 0) {
    return {}
  }
  
  return {
    OR: fields.map(field => ({
      [field]: {
        contains: searchTerm,
        mode: 'insensitive'
      }
    }))
  }
}

export function optimizeIncludes<T extends Record<string, any>>(
  includes: T,
  selectFields?: Record<string, boolean>
): T {
  if (!selectFields) {
    return includes
  }
  
  const optimized = {} as T
  
  for (const [key, value] of Object.entries(includes)) {
    if (value === true && selectFields) {
      optimized[key as keyof T] = { select: selectFields } as T[keyof T]
    } else {
      optimized[key as keyof T] = value
    }
  }
  
  return optimized
}

export function createCursorPagination(
  cursor: string | undefined,
  limit: number = 50
) {
  const take = Math.min(limit, 100) 
  
  if (!cursor) {
    return { take }
  }
  
  return {
    take,
    skip: 1, 
    cursor: { id: cursor }
  }
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  
  return function (...args: Parameters<T>) {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}
