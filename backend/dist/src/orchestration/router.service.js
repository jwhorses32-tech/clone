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
exports.RouterService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const gateway_registry_service_1 = require("../gateways/gateway-registry.service");
const merchant_gateways_service_1 = require("../gateways/merchant-gateways.service");
let RouterService = class RouterService {
    prisma;
    registry;
    merchantGateways;
    constructor(prisma, registry, merchantGateways) {
        this.prisma = prisma;
        this.registry = registry;
        this.merchantGateways = merchantGateways;
    }
    async routeForTenant(tenantId) {
        const rows = await this.prisma.merchantGateway.findMany({
            where: { tenantId, status: 'active' },
            include: { gateway: true },
        });
        const scored = [];
        for (const row of rows) {
            const adapter = this.registry.get(row.gateway.code);
            if (!adapter)
                continue;
            const score = (row.successRate ?? 0.5) *
                (row.weight / 100) *
                (1 / Math.max(row.costFactor, 0.01));
            let credentials = {};
            try {
                credentials = this.merchantGateways.decryptCredentials(row.encryptedCreds);
            }
            catch {
                continue;
            }
            scored.push({
                merchantGatewayId: row.id,
                gatewayCode: row.gateway.code,
                adapter,
                credentials,
                score,
            });
        }
        scored.sort((a, b) => b.score - a.score);
        return scored;
    }
};
exports.RouterService = RouterService;
exports.RouterService = RouterService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        gateway_registry_service_1.GatewayRegistryService,
        merchant_gateways_service_1.MerchantGatewaysService])
], RouterService);
//# sourceMappingURL=router.service.js.map