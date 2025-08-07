import type Redis from 'ioredis';

export class CacheService {
  private client: Redis;
  private enabled: boolean;

  constructor(client: Redis, enabled = true) {
    this.client = client;
    this.enabled = enabled;
  }

  async get<T>(key: string): Promise<T | null> {
    if (!this.enabled) return null;
    const raw = await this.client.get(key);
    return raw ? JSON.parse(raw) as T : null;
  }

  async set<T>(key: string, value: T, ttlSeconds = 3600): Promise<void> {
    if (!this.enabled) return;
    await this.client.set(key, JSON.stringify(value), 'EX', ttlSeconds);
  }
}