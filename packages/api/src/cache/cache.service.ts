import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class CacheService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  /**
   * Set cache
   * @param key
   * @param value
   * @param ttl
   */
  async setCache(key: string, value: any, ttl: number = 1000) {
    return await this.cacheManager.set(key, value, ttl);
  }

  /**
   * Get cache by key
   * @param key
   */
  async getCache(key: string) {
    return await this.cacheManager.get(key);
  }

  async deleteCache(key: string) {
    return await this.cacheManager.del(key);
  }
}
