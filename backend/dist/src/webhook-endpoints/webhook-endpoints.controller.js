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
exports.WebhookEndpointsController = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const tenant_guard_1 = require("../common/guards/tenant.guard");
const current_tenant_decorator_1 = require("../common/decorators/current-tenant.decorator");
const prisma_service_1 = require("../prisma/prisma.service");
const create_webhook_endpoint_dto_1 = require("./dto/create-webhook-endpoint.dto");
let WebhookEndpointsController = class WebhookEndpointsController {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    list(t) {
        return this.prisma.webhookEndpoint.findMany({
            where: { tenantId: t.tenantId },
            select: {
                id: true,
                url: true,
                events: true,
                isActive: true,
                createdAt: true,
            },
        });
    }
    async create(t, dto) {
        const secret = (0, crypto_1.randomBytes)(32).toString('hex');
        return this.prisma.webhookEndpoint.create({
            data: {
                tenantId: t.tenantId,
                url: dto.url,
                secret,
                events: dto.events?.length ? dto.events : ['*'],
            },
            select: {
                id: true,
                url: true,
                events: true,
                secret: true,
                createdAt: true,
            },
        });
    }
};
exports.WebhookEndpointsController = WebhookEndpointsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, current_tenant_decorator_1.CurrentTenant)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], WebhookEndpointsController.prototype, "list", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, current_tenant_decorator_1.CurrentTenant)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_webhook_endpoint_dto_1.CreateWebhookEndpointDto]),
    __metadata("design:returntype", Promise)
], WebhookEndpointsController.prototype, "create", null);
exports.WebhookEndpointsController = WebhookEndpointsController = __decorate([
    (0, common_1.Controller)('tenants/webhook-endpoints'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, tenant_guard_1.TenantGuard),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], WebhookEndpointsController);
//# sourceMappingURL=webhook-endpoints.controller.js.map