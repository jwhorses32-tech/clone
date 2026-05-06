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
exports.RiskController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const tenant_guard_1 = require("../common/guards/tenant.guard");
const current_tenant_decorator_1 = require("../common/decorators/current-tenant.decorator");
const risk_service_1 = require("./risk.service");
const add_blocklist_dto_1 = require("./dto/add-blocklist.dto");
const gdpr_delete_blocklist_dto_1 = require("./dto/gdpr-delete-blocklist.dto");
let RiskController = class RiskController {
    risk;
    constructor(risk) {
        this.risk = risk;
    }
    list(t) {
        return this.risk.listBlocklist(t.tenantId);
    }
    add(t, dto) {
        return this.risk.addBlocklist(t.tenantId, dto.type, dto.value, dto.reason);
    }
    remove(t, id) {
        return this.risk.removeBlocklist(id, t.tenantId);
    }
    gdprDelete(t, dto) {
        return this.risk.deleteByValue(t.tenantId, dto.type, dto.value);
    }
};
exports.RiskController = RiskController;
__decorate([
    (0, common_1.Get)('blocklist'),
    __param(0, (0, current_tenant_decorator_1.CurrentTenant)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], RiskController.prototype, "list", null);
__decorate([
    (0, common_1.Post)('blocklist'),
    __param(0, (0, current_tenant_decorator_1.CurrentTenant)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, add_blocklist_dto_1.AddBlocklistDto]),
    __metadata("design:returntype", void 0)
], RiskController.prototype, "add", null);
__decorate([
    (0, common_1.Delete)('blocklist/:id'),
    __param(0, (0, current_tenant_decorator_1.CurrentTenant)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], RiskController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)('blocklist/gdpr-delete'),
    __param(0, (0, current_tenant_decorator_1.CurrentTenant)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, gdpr_delete_blocklist_dto_1.GdprDeleteBlocklistDto]),
    __metadata("design:returntype", void 0)
], RiskController.prototype, "gdprDelete", null);
exports.RiskController = RiskController = __decorate([
    (0, common_1.Controller)('risk'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, tenant_guard_1.TenantGuard),
    __metadata("design:paramtypes", [risk_service_1.RiskService])
], RiskController);
//# sourceMappingURL=risk.controller.js.map