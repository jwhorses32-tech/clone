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
exports.InboundStripeController = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const gateway_registry_service_1 = require("../gateways/gateway-registry.service");
let InboundStripeController = class InboundStripeController {
    prisma;
    registry;
    constructor(prisma, registry) {
        this.prisma = prisma;
        this.registry = registry;
    }
    receive(signature, body) {
        const adapter = this.registry.get('stripe');
        const secret = process.env.STRIPE_WEBHOOK_SECRET ?? 'whsec_dev';
        const raw = JSON.stringify(body);
        if (signature &&
            adapter &&
            !adapter.verifyWebhook(raw, signature, secret)) {
            return { received: false };
        }
        void this.prisma.auditLog.create({
            data: {
                action: 'webhook.stripe',
                target: body.type ?? 'unknown',
                metadata: body,
            },
        });
        return { received: true };
    }
};
exports.InboundStripeController = InboundStripeController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Headers)('stripe-signature')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], InboundStripeController.prototype, "receive", null);
exports.InboundStripeController = InboundStripeController = __decorate([
    (0, common_1.Controller)('webhooks/stripe'),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        gateway_registry_service_1.GatewayRegistryService])
], InboundStripeController);
//# sourceMappingURL=inbound-stripe.controller.js.map