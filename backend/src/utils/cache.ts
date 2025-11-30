// Cache partagé en mémoire pour limiter la charge sur la base et accélérer les réponses.
// Utilise cache-manager avec le store mémoire par défaut.
import { caching, Cache, memoryStore } from 'cache-manager';
import { config } from '../config/config';

let sharedCachePromise: Promise<Cache> | null = null;

export async function getCache(): Promise<Cache> {
  if (!sharedCachePromise) {
    const store = memoryStore({
      ttl: config.responseCacheTtlSeconds,
      max: config.responseCacheMax,
    });
    sharedCachePromise = caching(store);
  }
  return sharedCachePromise;
}
