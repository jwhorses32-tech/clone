"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrchestrationModule = void 0;
const common_1 = require("@nestjs/common");
const idempotency_service_1 = require("./idempotency.service");
const router_service_1 = require("./router.service");
const failover_service_1 = require("./failover.service");
const gateways_module_1 = require("../gateways/gateways.module");
let OrchestrationModule = class OrchestrationModule {
};
exports.OrchestrationModule = OrchestrationModule;
exports.OrchestrationModule = OrchestrationModule = __decorate([
    (0, common_1.Module)({
        imports: [gateways_module_1.GatewaysModule],
        providers: [idempotency_service_1.IdempotencyService, router_service_1.RouterService, failover_service_1.FailoverService],
        exports: [idempotency_service_1.IdempotencyService, router_service_1.RouterService, failover_service_1.FailoverService],
    })
], OrchestrationModule);
//# sourceMappingURL=orchestration.module.js.map