import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { BlocklistType } from '@prisma/client';

export type RiskSignals = {
  email?: string;
  deviceFingerprint?: string;
  ip?: string;
  cardFingerprint?: string;
};

@Injectable()
export class RiskService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  redisKey(tenantId: string | null, type: BlocklistType): string {
    const scope = tenantId ?? 'global';
    return `bl:${scope}:${type}`;
  }

  async addBlocklist(
    tenantId: string | null,
    type: BlocklistType,
    value: string,
    reason?: string,
    expiresAt?: Date,
  ) {
    const normalized = value.toLowerCase();
    const entry = await this.prisma.blocklistEntry.create({
      data: {
        tenantId: tenantId ?? undefined,
        type,
        value: normalized,
        reason,
        expiresAt,
      },
    });
    await this.redis.sadd(this.redisKey(tenantId, type), normalized);
    return entry;
  }

  async removeBlocklist(id: string, tenantId: string | null) {
    const e = await this.prisma.blocklistEntry.findUnique({ where: { id } });
    if (!e) return null;
    if (tenantId !== null && e.tenantId !== tenantId) return null;
    await this.prisma.blocklistEntry.delete({ where: { id } });
    await this.redis.srem(
      this.redisKey(e.tenantId ?? null, e.type),
      e.value.toLowerCase(),
    );
    return { ok: true };
  }

  async deleteByValue(
    tenantId: string | null,
    type: BlocklistType,
    value: string,
  ) {
    const v = value.toLowerCase();
    const deleted = await this.prisma.blocklistEntry.deleteMany({
      where: { type, value: v, tenantId: tenantId === null ? null : tenantId },
    });
    await this.redis.srem(this.redisKey(tenantId, type), v);
    return { count: deleted.count };
  }

  async listBlocklist(tenantId: string | null) {
    return this.prisma.blocklistEntry.findMany({
      where:
        tenantId === null
          ? { tenantId: null }
          : { OR: [{ tenantId }, { tenantId: null }] },
      orderBy: { createdAt: 'desc' },
      take: 500,
    });
  }

  async isBlocked(
    tenantId: string,
    signals: RiskSignals,
  ): Promise<{ blocked: boolean; reason?: string }> {
    const checks: Array<{ type: BlocklistType; value?: string }> = [
      { type: 'EMAIL', value: signals.email?.toLowerCase() },
      { type: 'DEVICE', value: signals.deviceFingerprint },
      { type: 'IP', value: signals.ip },
      { type: 'CARD_FINGERPRINT', value: signals.cardFingerprint },
    ];

    for (const { type, value } of checks) {
      if (!value) continue;
      const normalized = value.toLowerCase();

      for (const scope of [tenantId, null] as const) {
        const redisHit =
          (await this.redis.sismember(
            this.redisKey(scope, type),
            normalized,
          )) === 1;
        const dbHit = await this.prisma.blocklistEntry.findFirst({
          where: {
            type,
            value: normalized,
            AND: [
              { OR: [{ tenantId: scope }, { tenantId: null }] },
              { OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }] },
            ],
          },
        });
        if (redisHit || dbHit) {
          return { blocked: true, reason: `${type}:${normalized}` };
        }
      }
    }

    return { blocked: false };
  }

  async syncRedisFromDb(): Promise<void> {
    const entries = await this.prisma.blocklistEntry.findMany({
      where: { OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }] },
    });
    for (const e of entries) {
      await this.redis.sadd(
        this.redisKey(e.tenantId ?? null, e.type),
        e.value.toLowerCase(),
      );
    }
  }
}
