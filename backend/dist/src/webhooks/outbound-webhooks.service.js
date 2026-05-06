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
var OutboundWebhooksService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.OutboundWebhooksService = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
const prisma_service_1 = require("../prisma/prisma.service");
let OutboundWebhooksService = OutboundWebhooksService_1 = class OutboundWebhooksService {
    prisma;
    logger = new common_1.Logger(OutboundWebhooksService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async dispatch(tenantId, eventType, payload) {
        const endpoints = await this.prisma.webhookEndpoint.findMany({
            where: { tenantId, isActive: true },
        });
        for (const ep of endpoints) {
            if (ep.events.length &&
                !ep.events.includes('*') &&
                !ep.events.includes(eventType)) {
                continue;
            }
            const eventId = (0, crypto_1.randomBytes)(16).toString('hex');
            const delivery = await this.prisma.webhookDelivery.create({
                data: {
                    endpointId: ep.id,
                    eventId,
                    eventType,
                    payload: { ...payload, event_id: eventId, type: eventType },
                    lastStatus: 'PENDING',
                },
            });
            void this.deliverWithRetries(ep.url, ep.secret, delivery.id, eventType, payload, eventId);
        }
    }
    async deliverWithRetries(url, secret, deliveryId, eventType, payload, eventId) {
        const bodyObj = { id: eventId, type: eventType, data: payload };
        const body = JSON.stringify(bodyObj);
        const signature = (0, crypto_1.createHmac)('sha256', secret).update(body).digest('hex');
        for (let attempt = 1; attempt <= 5; attempt++) {
            try {
                const res = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Webhook-Signature': `sha256=${signature}`,
                        'X-Webhook-Id': eventId,
                    },
                    body,
                });
                if (res.ok) {
                    await this.prisma.webhookDelivery.update({
                        where: { id: deliveryId },
                        data: { lastStatus: 'SUCCESS', attempts: attempt, lastError: null },
                    });
                    return;
                }
                await this.prisma.webhookDelivery.update({
                    where: { id: deliveryId },
                    data: { attempts: attempt, lastError: `HTTP ${res.status}` },
                });
            }
            catch (e) {
                this.logger.warn(`Webhook delivery ${deliveryId} attempt ${attempt}: ${e.message}`);
                await this.prisma.webhookDelivery.update({
                    where: { id: deliveryId },
                    data: { attempts: attempt, lastError: e.message },
                });
            }
            await new Promise((r) => setTimeout(r, Math.min(1000 * 2 ** (attempt - 1), 30000)));
        }
        await this.prisma.webhookDelivery.update({
            where: { id: deliveryId },
            data: { lastStatus: 'FAILED' },
        });
    }
};
exports.OutboundWebhooksService = OutboundWebhooksService;
exports.OutboundWebhooksService = OutboundWebhooksService = OutboundWebhooksService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], OutboundWebhooksService);
//# sourceMappingURL=outbound-webhooks.service.js.map