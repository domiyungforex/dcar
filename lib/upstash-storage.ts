import { Redis } from "@upstash/redis"

const redis = new Redis({
  url: process.env.KV_REST_API_URL || "",
  token: process.env.KV_REST_API_TOKEN || "",
})

/**
 * Upstash Redis utilities
 * Replaces Vercel Blob for faster, real-time data operations
 */

export interface StorageData {
  [key: string]: unknown
}

/**
 * Set data in Redis with optional TTL
 */
export async function setData(key: string, data: Record<string, unknown>, ttlSeconds?: number): Promise<void> {
  try {
    if (ttlSeconds) {
      await redis.setex(key, ttlSeconds, JSON.stringify(data))
    } else {
      await redis.set(key, JSON.stringify(data))
    }
  } catch (error) {
    console.error("[v0] Redis set error:", error)
    throw new Error("Failed to save data")
  }
}

/**
 * Get data from Redis
 */
export async function getData(key: string): Promise<Record<string, unknown> | null> {
  try {
    const data = await redis.get(key)
    return data ? (JSON.parse(data as string) as Record<string, unknown>) : null
  } catch (error) {
    console.error("[v0] Redis get error:", error)
    throw new Error("Failed to retrieve data")
  }
}

/**
 * Delete data from Redis
 */
export async function deleteData(key: string): Promise<void> {
  try {
    await redis.del(key)
  } catch (error) {
    console.error("[v0] Redis delete error:", error)
    throw new Error("Failed to delete data")
  }
}

/**
 * List all keys matching a pattern
 */
export async function listKeys(pattern: string): Promise<string[]> {
  try {
    const keys = await redis.keys(pattern)
    return keys as string[]
  } catch (error) {
    console.error("[v0] Redis keys error:", error)
    return []
  }
}

/**
 * Get all data for keys matching a pattern
 */
export async function getDataByPattern(pattern: string): Promise<Record<string, unknown>[]> {
  try {
    const keys = await listKeys(pattern)
    const results: Record<string, unknown>[] = []

    for (const key of keys) {
      const data = await getData(key)
      if (data) {
        results.push(data)
      }
    }

    return results
  } catch (error) {
    console.error("[v0] Redis pattern get error:", error)
    return []
  }
}

/**
 * Add item to a sorted set (useful for leaderboards, timestamps)
 */
export async function addToSortedSet(key: string, score: number, member: string): Promise<void> {
  try {
    await redis.zadd(key, { score, member })
  } catch (error) {
    console.error("[v0] Redis zadd error:", error)
    throw new Error("Failed to add to sorted set")
  }
}

/**
 * Get range from sorted set by score
 */
export async function getSortedSetByScore(
  key: string,
  minScore: number,
  maxScore: number,
): Promise<{ member: string; score: number }[]> {
  try {
    const results = await redis.zrange(key, minScore, maxScore, {
      byScore: true,
      rev: true,
    })
    return results as { member: string; score: number }[]
  } catch (error) {
    console.error("[v0] Redis zrange error:", error)
    return []
  }
}

/**
 * Increment a counter
 */
export async function increment(key: string, amount = 1): Promise<number> {
  try {
    const result = await redis.incrby(key, amount)
    return result as number
  } catch (error) {
    console.error("[v0] Redis increment error:", error)
    throw new Error("Failed to increment counter")
  }
}

/**
 * Check if key exists
 */
export async function exists(key: string): Promise<boolean> {
  try {
    const result = await redis.exists(key)
    return result === 1
  } catch (error) {
    console.error("[v0] Redis exists error:", error)
    return false
  }
}
