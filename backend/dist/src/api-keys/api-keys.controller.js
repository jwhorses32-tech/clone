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
exports.ApiKeysController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const tenant_guard_1 = require("../common/guards/tenant.guard");
const current_tenant_decorator_1 = require("../common/decorators/current-tenant.decorator");
const api_keys_service_1 = require("./api-keys.service");
const class_validator_1 = require("class-validator");
class CreateApiKeyDto {
    name;
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateApiKeyDto.prototype, "name", void 0);
let ApiKeysController = class ApiKeysController {
    svc;
    constructor(svc) {
        this.svc = svc;
    }
    list(t) {
        return this.svc.list(t.tenantId);
    }
    create(t, dto) {
        return this.svc.create(t.tenantId, dto.name);
    }
    revoke(t, id) {
        return this.svc.revoke(t.tenantId, id);
    }
};
exports.ApiKeysController = ApiKeysController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, current_tenant_decorator_1.CurrentTenant)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ApiKeysController.prototype, "list", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, current_tenant_decorator_1.CurrentTenant)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, CreateApiKeyDto]),
    __metadata("design:returntype", void 0)
], ApiKeysController.prototype, "create", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, current_tenant_decorator_1.CurrentTenant)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], ApiKeysController.prototype, "revoke", null);
exports.ApiKeysController = ApiKeysController = __decorate([
    (0, common_1.Controller)('tenants/api-keys'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, tenant_guard_1.TenantGuard),
    __metadata("design:paramtypes", [api_keys_service_1.ApiKeysService])
], ApiKeysController);
//# sourceMappingURL=api-keys.controller.js.map