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
exports.TenantsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const encryption_service_1 = require("../common/encryption.service");
let TenantsService = class TenantsService {
    prisma;
    encryption;
    constructor(prisma, encryption) {
        this.prisma = prisma;
        this.encryption = encryption;
    }
    async listForUser(userId) {
        return this.prisma.tenant.findMany({
            where: { memberships: { some: { userId } } },
            include: { plan: true },
            orderBy: { createdAt: 'desc' },
        });
    }
    async create(userId, brandSlug, displayName) {
        const slug = brandSlug
            .toLowerCase()
            .replace(/[^a-z0-9-]/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '');
        if (slug.length < 2)
            throw new common_1.ConflictException('brand_slug too short');
        const exists = await this.prisma.tenant.findUnique({
            where: { brandSlug: slug },
        });
        if (exists)
            throw new common_1.ConflictException('brand_slug taken');
        const tenant = await this.prisma.tenant.create({
            data: {
                brandSlug: slug,
                displayName,
                status: 'ACTIVE',
                memberships: { create: { userId, role: 'OWNER' } },
            },
        });
        const mockGateway = await this.prisma.gateway.findUnique({
            where: { code: 'mock' },
        });
        if (mockGateway) {
            const creds = this.encryption.encryptJson({ failRate: 0, latencyMs: 15 });
            await this.prisma.merchantGateway.create({
                data: {
                    tenantId: tenant.id,
                    gatewayId: mockGateway.id,
                    encryptedCreds: creds,
                    status: 'active',
                    weight: 100,
                    successRate: 0.95,
                    costFactor: 1,
                },
            });
        }
        return tenant;
    }
    async setStatus(tenantId, status) {
        return this.prisma.tenant.update({
            where: { id: tenantId },
            data: { status },
        });
    }
    async approveKyc(tenantId) {
        return this.prisma.tenant.update({
            where: { id: tenantId },
            data: { kycApprovedAt: new Date(), status: 'ACTIVE' },
        });
    }
};
exports.TenantsService = TenantsService;
exports.TenantsService = TenantsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        encryption_service_1.EncryptionService])
], TenantsService);
//# sourceMappingURL=tenants.service.js.map