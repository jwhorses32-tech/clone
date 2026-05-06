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
exports.InvoicesService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const crypto_1 = require("crypto");
const prisma_service_1 = require("../prisma/prisma.service");
let InvoicesService = class InvoicesService {
    prisma;
    config;
    constructor(prisma, config) {
        this.prisma = prisma;
        this.config = config;
    }
    paymentUrl(hostedPath) {
        const base = this.config.get('FRONTEND_URL', 'http://localhost:3000');
        return `${base}/pay/${hostedPath}`;
    }
    async createFromApi(tenantId, input) {
        const tenant = await this.prisma.tenant.findFirst({
            where: { id: tenantId, brandSlug: input.brand_slug },
        });
        if (!tenant) {
            throw new common_1.ForbiddenException('brand_slug does not match this API key');
        }
        if (input.idempotency_key) {
            const existingTx = await this.prisma.paymentTransaction.findFirst({
                where: { tenantId, idempotencyKey: input.idempotency_key },
                include: { invoice: true },
            });
            if (existingTx?.invoice) {
                const link = await this.prisma.paymentLink.findFirst({
                    where: { invoiceId: existingTx.invoice.id },
                });
                if (link) {
                    return {
                        data: {
                            invoice_id: existingTx.invoice.id,
                            payment_url: this.paymentUrl(link.hostedPath),
                            expires_at: existingTx.invoice.expiresAt?.toISOString() ?? null,
                        },
                    };
                }
            }
        }
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        const invoice = await this.prisma.invoice.create({
            data: {
                tenantId,
                orderReference: input.order_reference,
                amountCents: input.amount,
                currency: 'USD',
                status: 'OPEN',
                webhookUrl: input.webhook_url,
                expiresAt,
            },
        });
        const hostedPath = (0, crypto_1.randomBytes)(18).toString('base64url');
        const link = await this.prisma.paymentLink.create({
            data: {
                tenantId,
                invoiceId: invoice.id,
                amountCents: input.amount,
                currency: 'USD',
                status: 'ACTIVE',
                hostedPath,
                expiresAt,
            },
        });
        const tx = await this.prisma.paymentTransaction.create({
            data: {
                tenantId,
                invoiceId: invoice.id,
                amountCents: input.amount,
                currency: 'USD',
                status: 'CREATED',
                idempotencyKey: input.idempotency_key ?? null,
            },
        });
        return {
            data: {
                invoice_id: invoice.id,
                transaction_id: tx.id,
                payment_url: this.paymentUrl(link.hostedPath),
                expires_at: expiresAt.toISOString(),
            },
        };
    }
    async getPublicCheckout(hostedPath) {
        const link = await this.prisma.paymentLink.findUnique({
            where: { hostedPath },
            include: { tenant: true, invoice: true },
        });
        if (!link || link.status !== 'ACTIVE') {
            throw new common_1.NotFoundException('Payment link not found');
        }
        return {
            amount_cents: link.amountCents,
            currency: link.currency,
            brand: link.tenant.displayName,
            order_reference: link.invoice?.orderReference ?? null,
        };
    }
};
exports.InvoicesService = InvoicesService;
exports.InvoicesService = InvoicesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        config_1.ConfigService])
], InvoicesService);
//# sourceMappingURL=invoices.service.js.map