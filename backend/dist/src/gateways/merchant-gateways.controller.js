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
exports.MerchantGatewaysController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const tenant_guard_1 = require("../common/guards/tenant.guard");
const current_tenant_decorator_1 = require("../common/decorators/current-tenant.decorator");
const merchant_gateways_service_1 = require("./merchant-gateways.service");
const connect_gateway_dto_1 = require("./dto/connect-gateway.dto");
let MerchantGatewaysController = class MerchantGatewaysController {
    svc;
    constructor(svc) {
        this.svc = svc;
    }
    list(t) {
        return this.svc.list(t.tenantId);
    }
    connect(t, dto) {
        return this.svc.connect(t.tenantId, dto.gatewayCode, dto.credentials);
    }
};
exports.MerchantGatewaysController = MerchantGatewaysController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, current_tenant_decorator_1.CurrentTenant)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], MerchantGatewaysController.prototype, "list", null);
__decorate([
    (0, common_1.Post)('connect'),
    __param(0, (0, current_tenant_decorator_1.CurrentTenant)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, connect_gateway_dto_1.ConnectGatewayDto]),
    __metadata("design:returntype", void 0)
], MerchantGatewaysController.prototype, "connect", null);
exports.MerchantGatewaysController = MerchantGatewaysController = __decorate([
    (0, common_1.Controller)('tenants/gateways'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, tenant_guard_1.TenantGuard),
    __metadata("design:paramtypes", [merchant_gateways_service_1.MerchantGatewaysService])
], MerchantGatewaysController);
//# sourceMappingURL=merchant-gateways.controller.js.map