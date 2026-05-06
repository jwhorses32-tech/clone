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
exports.TransactionsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const router_service_1 = require("../orchestration/router.service");
const failover_service_1 = require("../orchestration/failover.service");
const risk_service_1 = require("../risk/risk.service");
const outbound_webhooks_service_1 = require("../webhooks/outbound-webhooks.service");
let TransactionsService = class TransactionsService {
    prisma;
    router;
    failover;
    risk;
    outbound;
    constructor(prisma, router, failover, risk, outbound) {
        this.prisma = prisma;
        this.router = router;
        this.failover = failover;
        this.risk = risk;
        this.outbound = outbound;
    }
    async listForTenant(tenantId, take = 50) {
        return this.prisma.paymentTransaction.findMany({
            where: { tenantId },
            orderBy: { createdAt: 'desc' },
            take,
            include: { attempts: { include: { gateway: true } }, invoice: true },
        });
    }
    async getOne(tenantId, id) {
        const tx = await this.prisma.paymentTransaction.findFirst({
            where: { id, tenantId },
            include: { attempts: { include: { gateway: true } }, invoice: true },
        });
        if (!tx)
            throw new common_1.NotFoundException();
        return tx;
    }
    async processHostedCheckout(hostedPath, body, ip) {
        const link = await this.prisma.paymentLink.findUnique({
            where: { hostedPath },
            include: { invoice: true, tenant: true },
        });
        if (!link || link.status !== 'ACTIVE')
            throw new common_1.NotFoundException('Invalid payment link');
        const risk = await this.risk.isBlocked(link.tenantId, {
            email: body.email,
            deviceFingerprint: body.deviceFingerprint,
            ip,
        });
        if (risk.blocked) {
            throw new common_1.ForbiddenException({
                message: 'Risk blocked',
                reason: risk.reason,
            });
        }
        const tx = link.invoiceId
            ? await this.prisma.paymentTransaction.findFirst({
                where: { tenantId: link.tenantId, invoiceId: link.invoiceId },
                orderBy: { createdAt: 'desc' },
            })
            : await this.prisma.paymentTransaction.findFirst({
                where: { tenantId: link.tenantId, status: 'CREATED' },
                orderBy: { createdAt: 'desc' },
            });
        if (!tx)
            throw new common_1.BadRequestException('No transaction for this link');
        await this.prisma.paymentTransaction.update({
            where: { id: tx.id },
            data: { status: 'ROUTING' },
        });
        const gateways = await this.router.routeForTenant(link.tenantId);
        if (!gateways.length) {
            throw new common_1.BadRequestException('No payment gateways configured for this merchant');
        }
        const gatewayRowCache = new Map();
        const getGatewayDbId = async (code) => {
            if (gatewayRowCache.has(code))
                return gatewayRowCache.get(code);
            const g = await this.prisma.gateway.findUniqueOrThrow({
                where: { code },
            });
            gatewayRowCache.set(code, g.id);
            return g.id;
        };
        const outcome = await this.failover.executeWithFailover(gateways, async (g) => {
            const start = Date.now();
            const res = await g.adapter.authorize({
                amountCents: link.amountCents,
                currency: link.currency,
                credentials: g.credentials,
                metadata: {
                    hostedPath,
                    invoiceId: link.invoiceId ?? '',
                    orderRef: link.invoice?.orderReference ?? '',
                },
            });
            const gatewayDbId = await getGatewayDbId(g.gatewayCode);
            await this.prisma.paymentTransactionAttempt.create({
                data: {
                    transactionId: tx.id,
                    gatewayId: gatewayDbId,
                    status: res.success ? 'SUCCEEDED' : 'FAILED',
                    gatewayRef: res.gatewayRef,
                    latencyMs: res.latencyMs ?? Date.now() - start,
                    errorCode: res.errorCode,
                    rawResponse: res.raw ?? undefined,
                },
            });
            return { ok: res.success, result: res, error: res.errorCode };
        });
        if (!outcome.ok) {
            await this.prisma.paymentTransaction.update({
                where: { id: tx.id },
                data: { status: 'FAILED' },
            });
            throw new common_1.BadRequestException({
                message: 'all_gateways_failed',
                errors: outcome.errors,
            });
        }
        await this.prisma.paymentTransaction.update({
            where: { id: tx.id },
            data: {
                status: 'SETTLED',
                customerFingerprint: body.deviceFingerprint ?? undefined,
            },
        });
        if (link.invoiceId) {
            await this.prisma.invoice.update({
                where: { id: link.invoiceId },
                data: { status: 'PAID' },
            });
        }
        await this.prisma.paymentLink.update({
            where: { id: link.id },
            data: { status: 'USED' },
        });
        await this.prisma.tenant.update({
            where: { id: link.tenantId },
            data: { monthlyVolumeCents: { increment: link.amountCents } },
        });
        const inv = link.invoice;
        if (inv?.webhookUrl) {
            void fetch(inv.webhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'invoice.paid',
                    data: { invoice_id: inv.id, amount_cents: link.amountCents },
                }),
            }).catch(() => undefined);
        }
        await this.outbound.dispatch(link.tenantId, 'invoice.paid', {
            invoice_id: link.invoiceId,
            transaction_id: tx.id,
            amount_cents: link.amountCents,
        });
        return { ok: true, transaction_id: tx.id };
    }
};
exports.TransactionsService = TransactionsService;
exports.TransactionsService = TransactionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        router_service_1.RouterService,
        failover_service_1.FailoverService,
        risk_service_1.RiskService,
        outbound_webhooks_service_1.OutboundWebhooksService])
], TransactionsService);
//# sourceMappingURL=transactions.service.js.map