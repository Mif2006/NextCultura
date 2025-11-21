// etg/cache.ts
import NodeCache from 'node-cache';
import { createClient as createRedisClient } from 'redis';

const TTL_SECONDS = Number(process.env.ETG_CACHE_TTL_SEC ?? 60 * 30); // 30 min default

let redisClient: any = null;
if (process.env.REDIS_URL) {
  redisClient = createRedisClient({ url: process.env.REDIS_URL });
  // connect lazily
  redisClient.connect().catch((err: any) => {
    console.error('Redis connect error for ETG cache:', err);
    redisClient = null;
  });
}

const memoryCache = new NodeCache({ stdTTL: TTL_SECONDS, checkperiod: 120 });

export async function cacheGet(key: string) {
  if (redisClient) {
    try {
      const val = await redisClient.get(key);
      return val ? JSON.parse(val) : undefined;
    } catch (err) {
      console.warn('Redis get error, falling back:', err);
    }
  }
  return memoryCache.get(key);
}

export async function cacheSet(key: string, value: any, ttlSec = TTL_SECONDS) {
  if (redisClient) {
    try {
      await redisClient.set(key, JSON.stringify(value), { EX: ttlSec });
      return;
    } catch (err) {
      console.warn('Redis set error, falling back:', err);
    }
  }
  memoryCache.set(key, value, ttlSec);
}
