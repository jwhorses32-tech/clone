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
exports.MerchantGatewaysService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const encryption_service_1 = require("../common/encryption.service");
const gateway_registry_service_1 = require("./gateway-registry.service");
let MerchantGatewaysService = class MerchantGatewaysService {
    prisma;
    encryption;
    registry;
    constructor(prisma, encryption, registry) {
        this.prisma = prisma;
        this.encryption = encryption;
        this.registry = registry;
    }
    async list(tenantId) {
        return this.prisma.merchantGateway.findMany({
            where: { tenantId },
            include: { gateway: true },
            orderBy: { updatedAt: 'desc' },
        });
    }
    async connect(tenantId, gatewayCode, credentials) {
        const adapter = this.registry.get(gatewayCode);
        if (!adapter)
            throw new common_1.BadRequestException(`Unknown gateway: ${gatewayCode}`);
        const gateway = await this.prisma.gateway.findUnique({
            where: { code: gatewayCode },
        });
        if (!gateway)
            throw new common_1.NotFoundException('Gateway not registered in catalog');
        const encryptedCreds = this.encryption.encryptJson(credentials);
        return this.prisma.merchantGateway.upsert({
            where: { tenantId_gatewayId: { tenantId, gatewayId: gateway.id } },
            create: {
                tenantId,
                gatewayId: gateway.id,
                encryptedCreds,
                status: 'active',
            },
            update: { encryptedCreds, status: 'active' },
            include: { gateway: true },
        });
    }
    decryptCredentials(encryptedCreds) {
        return this.encryption.decryptJson(encryptedCreds);
    }
};
exports.MerchantGatewaysService = MerchantGatewaysService;
exports.MerchantGatewaysService = MerchantGatewaysService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        encryption_service_1.EncryptionService,
        gateway_registry_service_1.GatewayRegistryService])
], MerchantGatewaysService);
//# sourceMappingURL=merchant-gateways.service.js.map