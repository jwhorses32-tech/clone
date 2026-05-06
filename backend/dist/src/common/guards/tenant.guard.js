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
exports.TenantGuard = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let TenantGuard = class TenantGuard {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async canActivate(context) {
        const req = context
            .switchToHttp()
            .getRequest();
        const user = req.user;
        if (!user)
            return false;
        const tenantId = req.headers['x-tenant-id'] ??
            req.query['tenantId'];
        if (!tenantId) {
            throw new common_1.BadRequestException('X-Tenant-Id header or tenantId query required');
        }
        const membership = await this.prisma.membership.findUnique({
            where: { userId_tenantId: { userId: user.sub, tenantId } },
        });
        if (!membership) {
            return false;
        }
        req.tenant = { tenantId, membershipRole: membership.role };
        return true;
    }
};
exports.TenantGuard = TenantGuard;
exports.TenantGuard = TenantGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TenantGuard);
//# sourceMappingURL=tenant.guard.js.map