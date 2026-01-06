

export interface PaginationParams {
  page?: number
  limit?: number
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

export function getPaginationParams(query: Record<string, any>): Required<PaginationParams> {
  const page = Math.max(1, parseInt(query.page as string) || 1)
  const limit = Math.min(100, Math.max(1, parseInt(query.limit as string) || 50))
  
  return { page, limit }
}

export async function paginate<T>(
  model: any,
  params: PaginationParams,
  where: any = {},
  orderBy: any = {}
): Promise<PaginatedResponse<T>> {
  const { page, limit } = getPaginationParams(params)
  const skip = (page - 1) * limit

  const [total, data] = await Promise.all([
    model.count({ where }),
    model.findMany({
      where,
      orderBy,
      skip,
      take: limit
    })
  ])
  
  const totalPages = Math.ceil(total / limit)
  
  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1
    }
  }
}

export function createPaginationMeta(
  page: number,
  limit: number,
  total: number
) {
  const totalPages = Math.ceil(total / limit)
  
  return {
    page,
    limit,
    total,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1
  }
}

export function getPaginationValues(params: PaginationParams) {
  const { page, limit } = getPaginationParams(params)
  const skip = (page - 1) * limit
  
  return { skip, take: limit }
}
