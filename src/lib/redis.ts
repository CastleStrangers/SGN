import { Redis } from "@upstash/redis";

/**
 * Redis client for caching and rate limiting
 * Using Upstash for serverless Redis
 */

let redis: Redis | null = null;

function getRedisClient(): Redis | null {
  if (!process.env.REDIS_URL) {
    console.warn("[Redis] REDIS_URL not configured, skipping Redis");
    return null;
  }

  if (!redis) {
    redis = new Redis({
      url: process.env.REDIS_URL,
      token: process.env.REDIS_TOKEN || "",
    });
  }

  return redis;
}

/**
 * Rate limiting helper - fixed window counter
 * @param key - identifier (e.g., user email, IP address)
 * @param limit - max requests
 * @param window - time window in seconds
 */
export async function isRateLimited(
  key: string,
  limit: number = 10,
  window: number = 60
): Promise<boolean> {
  const client = getRedisClient();
  if (!client) return false; // Skip if Redis not available

  try {
    const count = await client.incr(`ratelimit:${key}`);

    if (count === 1) {
      await client.expire(`ratelimit:${key}`, window);
    }

    return count > limit;
  } catch (error) {
    console.error("[Redis] Rate limit error:", error);
    return false; // Fail open
  }
}

/**
 * Cache helper - with TTL
 */
export async function getCache<T>(key: string): Promise<T | null> {
  const client = getRedisClient();
  if (!client) return null;

  try {
    const data = await client.get(key);
    return data ? JSON.parse(data as string) : null;
  } catch (error) {
    console.error("[Redis] Cache get error:", error);
    return null;
  }
}

export async function setCache<T>(
  key: string,
  value: T,
  ttl: number = 3600
): Promise<void> {
  const client = getRedisClient();
  if (!client) return;

  try {
    await client.setex(key, ttl, JSON.stringify(value));
  } catch (error) {
    console.error("[Redis] Cache set error:", error);
  }
}

export async function deleteCache(key: string): Promise<void> {
  const client = getRedisClient();
  if (!client) return;

  try {
    await client.del(key);
  } catch (error) {
    console.error("[Redis] Cache delete error:", error);
  }
}

/**
 * Invalidate cache pattern
 */
export async function invalidateCachePattern(pattern: string): Promise<void> {
  const client = getRedisClient();
  if (!client) return;

  try {
    const keys = await client.keys(pattern);
    if (keys.length > 0) {
      await client.del(...(keys as string[]));
    }
  } catch (error) {
    console.error("[Redis] Cache invalidation error:", error);
  }
}

/**
 * API usage tracking
 */
export async function trackApiUsage(userId: string): Promise<void> {
  const client = getRedisClient();
  if (!client) return;

  try {
    const today = new Date().toISOString().split("T")[0];
    const key = `api_usage:${userId}:${today}`;
    await client.incr(key);
    await client.expire(key, 86400); // 24 hours
  } catch (error) {
    console.error("[Redis] API usage tracking error:", error);
  }
}

/**
 * Session management
 */
export async function setSession(
  sessionId: string,
  data: Record<string, any>,
  ttl: number = 86400
): Promise<void> {
  const client = getRedisClient();
  if (!client) return;

  try {
    await client.setex(`session:${sessionId}`, ttl, JSON.stringify(data));
  } catch (error) {
    console.error("[Redis] Session set error:", error);
  }
}

export async function getSession(
  sessionId: string
): Promise<Record<string, any> | null> {
  const client = getRedisClient();
  if (!client) return null;

  try {
    const data = await client.get(`session:${sessionId}`);
    return data ? JSON.parse(data as string) : null;
  } catch (error) {
    console.error("[Redis] Session get error:", error);
    return null;
  }
}

export async function deleteSession(sessionId: string): Promise<void> {
  const client = getRedisClient();
  if (!client) return;

  try {
    await client.del(`session:${sessionId}`);
  } catch (error) {
    console.error("[Redis] Session delete error:", error);
  }
}
