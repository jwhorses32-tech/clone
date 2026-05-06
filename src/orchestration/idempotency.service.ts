import { Injectable } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class IdempotencyService {
  constructor(private readonly redis: RedisService) {}

  /** Returns true if this is the first time seeing the key (safe to proceed). */
  async tryBegin(key: string, ttlSec = 86400): Promise<boolean> {
    return this.redis.setNxEx(`idem:${key}`, '1', ttlSec);
  }
}
