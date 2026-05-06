import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  readonly client: Redis | null;

  constructor() {
    const url = process.env.REDIS_URL;
    if (!url) {
      this.logger.warn(
        'REDIS_URL not set — idempotency and blocklist use in-memory fallback',
      );
      this.client = null;
      return;
    }
    this.client = new Redis(url, { maxRetriesPerRequest: null });
  }

  private memSets = new Map<string, Set<string>>();
  private memKv = new Map<string, string>();

  async setNxEx(key: string, value: string, ttlSec: number): Promise<boolean> {
    if (this.client) {
      const r = await this.client.set(key, value, 'EX', ttlSec, 'NX');
      return r === 'OK';
    }
    if (this.memKv.has(key)) return false;
    this.memKv.set(key, value);
    setTimeout(() => this.memKv.delete(key), ttlSec * 1000).unref?.();
    return true;
  }

  async sadd(key: string, ...members: string[]): Promise<void> {
    if (this.client) {
      await this.client.sadd(key, ...members);
      return;
    }
    let s = this.memSets.get(key);
    if (!s) {
      s = new Set();
      this.memSets.set(key, s);
    }
    members.forEach((m) => s.add(m));
  }

  async sismember(key: string, member: string): Promise<number> {
    if (this.client) return this.client.sismember(key, member);
    return this.memSets.get(key)?.has(member) ? 1 : 0;
  }

  async srem(key: string, ...members: string[]): Promise<void> {
    if (this.client) {
      await this.client.srem(key, ...members);
      return;
    }
    const s = this.memSets.get(key);
    if (!s) return;
    members.forEach((m) => s.delete(m));
  }

  onModuleDestroy(): void {
    void this.client?.quit();
  }
}
