/**
 * Comprehensive Caching Service
 * Implements requirements 10.1, 10.2, 10.3, 10.4
 * 
 * Provides multi-layer caching with:
 * - Memory cache for immediate access
 * - Local storage for persistence
 * - Cache invalidation and cleanup
 * - Performance optimization
 */

export interface CacheEntry<T = any> {
  data: T;
  timestamp: number;
  expiresAt: number;
  accessCount: number;
  lastAccessed: number;
  size?: number;
}

export interface CacheConfig {
  maxMemorySize: number; // bytes
  maxLocalStorageSize: number; // bytes
  defaultTTL: number; // milliseconds
  cleanupInterval: number; // milliseconds
  compressionEnabled: boolean;
}

export interface CacheStats {
  memoryHits: number;
  memoryMisses: number;
  localStorageHits: number;
  localStorageMisses: number;
  totalSize: number;
  entryCount: number;
  hitRate: number;
}

export class CacheService {
  private static instance: CacheService;
  private memoryCache = new Map<string, CacheEntry>();
  private config: CacheConfig;
  private stats: CacheStats;
  private cleanupTimer?: NodeJS.Timeout;

  private constructor(config?: Partial<CacheConfig>) {
    this.config = {
      maxMemorySize: 50 * 1024 * 1024, // 50MB
      maxLocalStorageSize: 100 * 1024 * 1024, // 100MB
      defaultTTL: 24 * 60 * 60 * 1000, // 24 hours
      cleanupInterval: 5 * 60 * 1000, // 5 minutes
      compressionEnabled: true,
      ...config
    };

    this.stats = {
      memoryHits: 0,
      memoryMisses: 0,
      localStorageHits: 0,
      localStorageMisses: 0,
      totalSize: 0,
      entryCount: 0,
      hitRate: 0
    };

    this.startCleanupTimer();
  }

  static getInstance(config?: Partial<CacheConfig>): CacheService {
    if (!CacheService.instance) {
      CacheService.instance = new CacheService(config);
    }
    return CacheService.instance;
  }

  /**
   * Get cached data with fallback to localStorage
   */
  async get<T>(key: string): Promise<T | null> {
    try {
      // Check memory cache first
      const memoryEntry = this.memoryCache.get(key);
      if (memoryEntry && !this.isExpired(memoryEntry)) {
        memoryEntry.accessCount++;
        memoryEntry.lastAccessed = Date.now();
        this.stats.memoryHits++;
        this.updateHitRate();
        return memoryEntry.data as T;
      }

      this.stats.memoryMisses++;

      // Check localStorage
      const localStorageEntry = await this.getFromLocalStorage<T>(key);
      if (localStorageEntry && !this.isExpired(localStorageEntry)) {
        // Promote to memory cache
        this.memoryCache.set(key, localStorageEntry);
        this.stats.localStorageHits++;
        this.updateHitRate();
        return localStorageEntry.data as T;
      }

      this.stats.localStorageMisses++;
      this.updateHitRate();
      return null;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }

  /**
   * Set data in both memory and localStorage
   */
  async set<T>(key: string, data: T, ttl?: number): Promise<void> {
    try {
      const expiresAt = Date.now() + (ttl || this.config.defaultTTL);
      const entry: CacheEntry<T> = {
        data,
        timestamp: Date.now(),
        expiresAt,
        accessCount: 0,
        lastAccessed: Date.now(),
        size: this.calculateSize(data)
      };

      // Set in memory cache
      this.memoryCache.set(key, entry);

      // Set in localStorage
      await this.setToLocalStorage(key, entry);

      // Cleanup if needed
      await this.cleanupIfNeeded();

      this.updateStats();
    } catch (error) {
      console.error('Cache set error:', error);
    }
  }

  /**
   * Remove from both caches
   */
  async remove(key: string): Promise<void> {
    this.memoryCache.delete(key);
    await this.removeFromLocalStorage(key);
    this.updateStats();
  }

  /**
   * Clear all caches
   */
  async clear(): Promise<void> {
    this.memoryCache.clear();
    await this.clearLocalStorage();
    this.resetStats();
  }

  /**
   * Get cache statistics
   */
  getStats(): CacheStats {
    return { ...this.stats };
  }

  /**
   * Batch get multiple keys
   */
  async getBatch<T>(keys: string[]): Promise<Map<string, T | null>> {
    const results = new Map<string, T | null>();
    
    // Use Promise.all for parallel retrieval
    const promises = keys.map(async (key) => {
      const value = await this.get<T>(key);
      return { key, value };
    });

    const resolved = await Promise.all(promises);
    resolved.forEach(({ key, value }) => {
      results.set(key, value);
    });

    return results;
  }

  /**
   * Batch set multiple key-value pairs
   */
  async setBatch<T>(entries: Array<{ key: string; data: T; ttl?: number }>): Promise<void> {
    const promises = entries.map(({ key, data, ttl }) => 
      this.set(key, data, ttl)
    );
    
    await Promise.all(promises);
  }

  /**
   * Get or set pattern - retrieve from cache or compute and cache
   */
  async getOrSet<T>(
    key: string, 
    factory: () => Promise<T>, 
    ttl?: number
  ): Promise<T> {
    const cached = await this.get<T>(key);
    if (cached !== null) {
      return cached;
    }

    const data = await factory();
    await this.set(key, data, ttl);
    return data;
  }

  /**
   * Invalidate cache entries by pattern
   */
  async invalidatePattern(pattern: string): Promise<void> {
    const regex = new RegExp(pattern);
    
    // Clear from memory cache
    for (const key of this.memoryCache.keys()) {
      if (regex.test(key)) {
        this.memoryCache.delete(key);
      }
    }

    // Clear from localStorage
    const localStorageKeys = await this.getLocalStorageKeys();
    const keysToRemove = localStorageKeys.filter(key => regex.test(key));
    
    await Promise.all(keysToRemove.map(key => this.removeFromLocalStorage(key)));
    
    this.updateStats();
  }

  /**
   * Preload cache with data
   */
  async preload<T>(entries: Array<{ key: string; factory: () => Promise<T>; ttl?: number }>): Promise<void> {
    const promises = entries.map(async ({ key, factory, ttl }) => {
      const exists = await this.get(key);
      if (!exists) {
        const data = await factory();
        await this.set(key, data, ttl);
      }
    });

    await Promise.all(promises);
  }

  // Private methods

  private isExpired(entry: CacheEntry): boolean {
    return Date.now() > entry.expiresAt;
  }

  private async getFromLocalStorage<T>(key: string): Promise<CacheEntry<T> | null> {
    try {
      const stored = localStorage.getItem(`cache_${key}`);
      if (!stored) return null;

      const parsed = JSON.parse(stored);
      
      // Decompress if needed
      if (this.config.compressionEnabled && parsed.compressed) {
        parsed.data = this.decompress(parsed.data);
      }

      return parsed;
    } catch (error) {
      console.error('LocalStorage get error:', error);
      return null;
    }
  }

  private async setToLocalStorage<T>(key: string, entry: CacheEntry<T>): Promise<void> {
    try {
      let dataToStore = { ...entry };

      // Compress if enabled and data is large
      if (this.config.compressionEnabled && entry.size && entry.size > 1024) {
        dataToStore.data = this.compress(entry.data);
        dataToStore.compressed = true;
      }

      localStorage.setItem(`cache_${key}`, JSON.stringify(dataToStore));
    } catch (error) {
      // Handle quota exceeded
      if (error.name === 'QuotaExceededError') {
        await this.evictLeastRecentlyUsed();
        // Try again
        try {
          localStorage.setItem(`cache_${key}`, JSON.stringify(entry));
        } catch (retryError) {
          console.error('LocalStorage set retry failed:', retryError);
        }
      } else {
        console.error('LocalStorage set error:', error);
      }
    }
  }

  private async removeFromLocalStorage(key: string): Promise<void> {
    try {
      localStorage.removeItem(`cache_${key}`);
    } catch (error) {
      console.error('LocalStorage remove error:', error);
    }
  }

  private async clearLocalStorage(): Promise<void> {
    try {
      const keys = await this.getLocalStorageKeys();
      keys.forEach(key => localStorage.removeItem(key));
    } catch (error) {
      console.error('LocalStorage clear error:', error);
    }
  }

  private async getLocalStorageKeys(): Promise<string[]> {
    const keys: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('cache_')) {
        keys.push(key);
      }
    }
    return keys;
  }

  private calculateSize(data: any): number {
    try {
      return new Blob([JSON.stringify(data)]).size;
    } catch {
      return JSON.stringify(data).length * 2; // Rough estimate
    }
  }

  private compress(data: any): string {
    // Simple compression - in production, use a proper compression library
    return btoa(JSON.stringify(data));
  }

  private decompress(compressed: string): any {
    try {
      return JSON.parse(atob(compressed));
    } catch {
      return compressed; // Fallback if decompression fails
    }
  }

  private async cleanupIfNeeded(): Promise<void> {
    const memorySize = this.calculateMemorySize();
    const localStorageSize = await this.calculateLocalStorageSize();

    if (memorySize > this.config.maxMemorySize) {
      await this.evictLeastRecentlyUsed('memory');
    }

    if (localStorageSize > this.config.maxLocalStorageSize) {
      await this.evictLeastRecentlyUsed('localStorage');
    }
  }

  private calculateMemorySize(): number {
    let size = 0;
    for (const entry of this.memoryCache.values()) {
      size += entry.size || 0;
    }
    return size;
  }

  private async calculateLocalStorageSize(): Promise<number> {
    let size = 0;
    const keys = await this.getLocalStorageKeys();
    
    for (const key of keys) {
      try {
        const item = localStorage.getItem(key);
        if (item) {
          size += item.length * 2; // Rough estimate
        }
      } catch (error) {
        console.error('Error calculating localStorage size:', error);
      }
    }
    
    return size;
  }

  private async evictLeastRecentlyUsed(target: 'memory' | 'localStorage' | 'both' = 'both'): Promise<void> {
    if (target === 'memory' || target === 'both') {
      // Sort by last accessed time and remove oldest
      const entries = Array.from(this.memoryCache.entries())
        .sort(([, a], [, b]) => a.lastAccessed - b.lastAccessed);
      
      const toRemove = Math.ceil(entries.length * 0.2); // Remove 20%
      for (let i = 0; i < toRemove; i++) {
        this.memoryCache.delete(entries[i][0]);
      }
    }

    if (target === 'localStorage' || target === 'both') {
      const keys = await this.getLocalStorageKeys();
      const entries: Array<{ key: string; lastAccessed: number }> = [];

      for (const key of keys) {
        try {
          const item = localStorage.getItem(key);
          if (item) {
            const parsed = JSON.parse(item);
            entries.push({ key, lastAccessed: parsed.lastAccessed || 0 });
          }
        } catch (error) {
          // Remove corrupted entries
          localStorage.removeItem(key);
        }
      }

      entries.sort((a, b) => a.lastAccessed - b.lastAccessed);
      const toRemove = Math.ceil(entries.length * 0.2);
      
      for (let i = 0; i < toRemove; i++) {
        localStorage.removeItem(entries[i].key);
      }
    }
  }

  private startCleanupTimer(): void {
    this.cleanupTimer = setInterval(() => {
      this.performCleanup();
    }, this.config.cleanupInterval);
  }

  private async performCleanup(): Promise<void> {
    // Remove expired entries from memory cache
    for (const [key, entry] of this.memoryCache.entries()) {
      if (this.isExpired(entry)) {
        this.memoryCache.delete(key);
      }
    }

    // Remove expired entries from localStorage
    const keys = await this.getLocalStorageKeys();
    for (const key of keys) {
      try {
        const item = localStorage.getItem(key);
        if (item) {
          const parsed = JSON.parse(item);
          if (this.isExpired(parsed)) {
            localStorage.removeItem(key);
          }
        }
      } catch (error) {
        // Remove corrupted entries
        localStorage.removeItem(key);
      }
    }

    this.updateStats();
  }

  private updateStats(): void {
    this.stats.entryCount = this.memoryCache.size;
    this.stats.totalSize = this.calculateMemorySize();
    this.updateHitRate();
  }

  private updateHitRate(): void {
    const totalRequests = this.stats.memoryHits + this.stats.memoryMisses + 
                         this.stats.localStorageHits + this.stats.localStorageMisses;
    const totalHits = this.stats.memoryHits + this.stats.localStorageHits;
    
    this.stats.hitRate = totalRequests > 0 ? (totalHits / totalRequests) * 100 : 0;
  }

  private resetStats(): void {
    this.stats = {
      memoryHits: 0,
      memoryMisses: 0,
      localStorageHits: 0,
      localStorageMisses: 0,
      totalSize: 0,
      entryCount: 0,
      hitRate: 0
    };
  }

  /**
   * Cleanup on instance destruction
   */
  destroy(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
    }
  }
}

// Export singleton instance
export const cacheService = CacheService.getInstance();