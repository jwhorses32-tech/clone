"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RiskService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const redis_service_1 = require("../redis/redis.service");
let RiskService = class RiskService {
    prisma;
    redis;
    constructor(prisma, redis) {
        this.prisma = prisma;
        this.redis = redis;
    }
    redisKey(tenantId, type) {
        const scope = tenantId ?? 'global';
        return `bl:${scope}:${type}`;
    }
    async addBlocklist(tenantId, type, value, reason, expiresAt) {
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
    async removeBlocklist(id, tenantId) {
        const e = await this.prisma.blocklistEntry.findUnique({ where: { id } });
        if (!e)
            return null;
        if (tenantId !== null && e.tenantId !== tenantId)
            return null;
        await this.prisma.blocklistEntry.delete({ where: { id } });
        await this.redis.srem(this.redisKey(e.tenantId ?? null, e.type), e.value.toLowerCase());
        return { ok: true };
    }
    async deleteByValue(tenantId, type, value) {
        const v = value.toLowerCase();
        const deleted = await this.prisma.blocklistEntry.deleteMany({
            where: { type, value: v, tenantId: tenantId === null ? null : tenantId },
        });
        await this.redis.srem(this.redisKey(tenantId, type), v);
        return { count: deleted.count };
    }
    async listBlocklist(tenantId) {
        return this.prisma.blocklistEntry.findMany({
            where: tenantId === null
                ? { tenantId: null }
                : { OR: [{ tenantId }, { tenantId: null }] },
            orderBy: { createdAt: 'desc' },
            take: 500,
        });
    }
    async isBlocked(tenantId, signals) {
        const checks = [
            { type: 'EMAIL', value: signals.email?.toLowerCase() },
            { type: 'DEVICE', value: signals.deviceFingerprint },
            { type: 'IP', value: signals.ip },
            { type: 'CARD_FINGERPRINT', value: signals.cardFingerprint },
        ];
        for (const { type, value } of checks) {
            if (!value)
                continue;
            const normalized = value.toLowerCase();
            for (const scope of [tenantId, null]) {
                const redisHit = (await this.redis.sismember(this.redisKey(scope, type), normalized)) === 1;
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
    async syncRedisFromDb() {
        const entries = await this.prisma.blocklistEntry.findMany({
            where: { OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }] },
        });
        for (const e of entries) {
            await this.redis.sadd(this.redisKey(e.tenantId ?? null, e.type), e.value.toLowerCase());
        }
    }
};
exports.RiskService = RiskService;
exports.RiskService = RiskService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        redis_service_1.RedisService])
], RiskService);
//# sourceMappingURL=risk.service.js.map