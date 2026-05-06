import { RedisService } from '../redis/redis.service';
export declare class IdempotencyService {
    private readonly redis;
    constructor(redis: RedisService);
    tryBegin(key: string, ttlSec?: number): Promise<boolean>;
}
