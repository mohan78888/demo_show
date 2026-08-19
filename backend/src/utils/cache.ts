export interface ICacheStore {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, data: T, ttlSeconds?: number): Promise<void>;
  delete(key: string): Promise<void>;
}

class InMemoryCacheStore implements ICacheStore {
  private cache = new Map<string, { data: any; expiresAt: number }>();
  private maxKeys = 500;

  async get<T>(key: string): Promise<T | null> {
    const item = this.cache.get(key);
    if (!item) return null;
    if (Date.now() > item.expiresAt) {
      this.cache.delete(key);
      return null;
    }
    return item.data as T;
  }

  async set<T>(key: string, data: T, ttlSeconds = 600): Promise<void> {
    if (this.cache.size >= this.maxKeys) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey !== undefined) this.cache.delete(firstKey);
    }
    this.cache.set(key, {
      data,
      expiresAt: Date.now() + ttlSeconds * 1000,
    });
  }

  async delete(key: string): Promise<void> {
    this.cache.delete(key);
  }
}

export const cacheStore: ICacheStore = new InMemoryCacheStore();
