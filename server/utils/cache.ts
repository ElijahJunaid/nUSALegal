import { Redis } from '@upstash/redis'

let redisClient: Redis | null = null

if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  try {
    redisClient = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN
    })
    console.log('✅ Redis cache initialized')
  } catch (error) {
    console.warn('⚠️  Redis initialization failed:', error)
  }
} else {
  console.log('ℹ️  Redis not configured - caching disabled')
}

export const redis = redisClient

export async function getCachedOrFetch<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl: number = 300
): Promise<T> {
  
  if (!redis) {
    return await fetcher()
  }

  try {
    
    const cached = await redis.get(key)
    
    if (cached !== null) {
      return cached as T
    }
  } catch (error) {
    console.warn('Cache read error:', error)
  }

  const data = await fetcher()

  if (redis) {
    redis.setex(key, ttl, JSON.stringify(data)).catch(err => {
      console.warn('Cache write error:', err)
    })
  }

  return data
}

export async function invalidateCache(key: string): Promise<void> {
  if (!redis) return

  try {
    await redis.del(key)
  } catch (error) {
    console.warn('Cache invalidation error:', error)
  }
}

export async function invalidateCachePattern(pattern: string): Promise<void> {
  if (!redis) return

  try {
    const keys = await redis.keys(pattern)
    if (keys.length > 0) {
      await redis.del(...keys)
    }
  } catch (error) {
    console.warn('Cache pattern invalidation error:', error)
  }
}

export async function getCache<T>(key: string): Promise<T | null> {
  if (!redis) return null

  try {
    const value = await redis.get(key)
    return value as T | null
  } catch (error) {
    console.warn('Cache get error:', error)
    return null
  }
}

export async function setCache<T>(
  key: string,
  value: T,
  ttl: number = 300
): Promise<void> {
  if (!redis) return

  try {
    await redis.setex(key, ttl, JSON.stringify(value))
  } catch (error) {
    console.warn('Cache set error:', error)
  }
}
