import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { BlocklistType } from '@prisma/client';
export type RiskSignals = {
    email?: string;
    deviceFingerprint?: string;
    ip?: string;
    cardFingerprint?: string;
};
export declare class RiskService {
    private readonly prisma;
    private readonly redis;
    constructor(prisma: PrismaService, redis: RedisService);
    redisKey(tenantId: string | null, type: BlocklistType): string;
    addBlocklist(tenantId: string | null, type: BlocklistType, value: string, reason?: string, expiresAt?: Date): Promise<{
        id: string;
        createdAt: Date;
        type: import("@prisma/client").$Enums.BlocklistType;
        tenantId: string | null;
        value: string;
        reason: string | null;
        expiresAt: Date | null;
    }>;
    removeBlocklist(id: string, tenantId: string | null): Promise<{
        ok: boolean;
    } | null>;
    deleteByValue(tenantId: string | null, type: BlocklistType, value: string): Promise<{
        count: number;
    }>;
    listBlocklist(tenantId: string | null): Promise<{
        id: string;
        createdAt: Date;
        type: import("@prisma/client").$Enums.BlocklistType;
        tenantId: string | null;
        value: string;
        reason: string | null;
        expiresAt: Date | null;
    }[]>;
    isBlocked(tenantId: string, signals: RiskSignals): Promise<{
        blocked: boolean;
        reason?: string;
    }>;
    syncRedisFromDb(): Promise<void>;
}
