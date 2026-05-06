import { OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';
export declare class RedisService implements OnModuleDestroy {
    private readonly logger;
    readonly client: Redis | null;
    constructor();
    private memSets;
    private memKv;
    setNxEx(key: string, value: string, ttlSec: number): Promise<boolean>;
    sadd(key: string, ...members: string[]): Promise<void>;
    sismember(key: string, member: string): Promise<number>;
    srem(key: string, ...members: string[]): Promise<void>;
    onModuleDestroy(): void;
}
