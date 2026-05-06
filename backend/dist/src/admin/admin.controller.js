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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const prisma_service_1 = require("../prisma/prisma.service");
const tenants_service_1 = require("../tenants/tenants.service");
const gateway_registry_service_1 = require("../gateways/gateway-registry.service");
const risk_service_1 = require("../risk/risk.service");
const class_validator_1 = require("class-validator");
const client_1 = require("@prisma/client");
class UpdateTenantAdminDto {
    status;
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.TenantStatus),
    __metadata("design:type", String)
], UpdateTenantAdminDto.prototype, "status", void 0);
class GlobalBlocklistDto {
    type;
    value;
    reason;
}
__decorate([
    (0, class_validator_1.IsEnum)(client_1.BlocklistType),
    __metadata("design:type", String)
], GlobalBlocklistDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    __metadata("design:type", String)
], GlobalBlocklistDto.prototype, "value", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GlobalBlocklistDto.prototype, "reason", void 0);
let AdminController = class AdminController {
    prisma;
    tenants;
    gateways;
    risk;
    constructor(prisma, tenants, gateways, risk) {
        this.prisma = prisma;
        this.tenants = tenants;
        this.gateways = gateways;
        this.risk = risk;
    }
    listTenants() {
        return this.prisma.tenant.findMany({
            orderBy: { createdAt: 'desc' },
            take: 200,
            include: {
                plan: true,
                memberships: { include: { user: { select: { email: true } } } },
            },
        });
    }
    updateTenant(id, dto) {
        if (dto.status)
            return this.tenants.setStatus(id, dto.status);
        return this.prisma.tenant.findUnique({ where: { id } });
    }
    kyc(id) {
        return this.tenants.approveKyc(id);
    }
    async gatewaysHealth() {
        const adapters = this.gateways.list();
        const results = await Promise.all(adapters.map(async (a) => ({ code: a.code, ...(await a.getHealth()) })));
        return { gateways: results };
    }
    addGlobalBlocklist(body) {
        return this.risk.addBlocklist(null, body.type, body.value, body.reason);
    }
};
exports.AdminController = AdminController;
__decorate([
    (0, common_1.Get)('tenants'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "listTenants", null);
__decorate([
    (0, common_1.Patch)('tenants/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UpdateTenantAdminDto]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "updateTenant", null);
__decorate([
    (0, common_1.Patch)('tenants/:id/kyc-approve'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "kyc", null);
__decorate([
    (0, common_1.Get)('gateways/health'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "gatewaysHealth", null);
__decorate([
    (0, common_1.Post)('risk/blocklist/global'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [GlobalBlocklistDto]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "addGlobalBlocklist", null);
exports.AdminController = AdminController = __decorate([
    (0, common_1.Controller)('admin'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN', 'STAFF'),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        tenants_service_1.TenantsService,
        gateway_registry_service_1.GatewayRegistryService,
        risk_service_1.RiskService])
], AdminController);
//# sourceMappingURL=admin.controller.js.map