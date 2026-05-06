"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var StripeGatewayAdapter_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.StripeGatewayAdapter = void 0;
const common_1 = require("@nestjs/common");
const stripe_1 = __importDefault(require("stripe"));
const STRIPE_API_VERSION = '2026-04-22.dahlia';
function pickStripeSecret(creds) {
    const a = creds['secretKey'];
    const b = creds['stripeSecretKey'];
    if (typeof a === 'string')
        return a;
    if (typeof b === 'string')
        return b;
    return '';
}
let StripeGatewayAdapter = StripeGatewayAdapter_1 = class StripeGatewayAdapter {
    code = 'stripe';
    logger = new common_1.Logger(StripeGatewayAdapter_1.name);
    async authorize(ctx) {
        const start = Date.now();
        const secret = pickStripeSecret(ctx.credentials);
        if (!secret) {
            return {
                success: false,
                errorCode: 'missing_secret',
                latencyMs: Date.now() - start,
            };
        }
        try {
            const stripe = new stripe_1.default(secret, { apiVersion: STRIPE_API_VERSION });
            const pi = await stripe.paymentIntents.create({
                amount: ctx.amountCents,
                currency: ctx.currency.toLowerCase(),
                automatic_payment_methods: { enabled: true },
                metadata: ctx.metadata ?? {},
            });
            return {
                success: true,
                gatewayRef: pi.id,
                latencyMs: Date.now() - start,
                raw: { clientSecret: pi.client_secret },
            };
        }
        catch (e) {
            this.logger.warn(`Stripe authorize failed: ${e.message}`);
            return {
                success: false,
                errorCode: 'stripe_error',
                latencyMs: Date.now() - start,
                raw: String(e),
            };
        }
    }
    async capture(ctx) {
        const secret = pickStripeSecret(ctx.credentials);
        const stripe = new stripe_1.default(secret, { apiVersion: STRIPE_API_VERSION });
        const pi = await stripe.paymentIntents.capture(ctx.gatewayRef);
        return { success: pi.status === 'succeeded', gatewayRef: pi.id, raw: pi };
    }
    async refund(ctx) {
        const secret = pickStripeSecret(ctx.credentials);
        const stripe = new stripe_1.default(secret, { apiVersion: STRIPE_API_VERSION });
        const r = await stripe.refunds.create({
            payment_intent: ctx.gatewayRef,
            amount: ctx.amountCents,
        });
        return { success: true, gatewayRef: r.id, raw: r };
    }
    async void(ctx) {
        const secret = pickStripeSecret(ctx.credentials);
        const stripe = new stripe_1.default(secret, { apiVersion: STRIPE_API_VERSION });
        await stripe.paymentIntents.cancel(ctx.gatewayRef);
        return { success: true, gatewayRef: ctx.gatewayRef };
    }
    verifyWebhook(payload, signature, secret) {
        if (!signature)
            return false;
        try {
            stripe_1.default.webhooks.constructEvent(payload, signature, secret);
            return true;
        }
        catch {
            return false;
        }
    }
    getHealth() {
        return Promise.resolve({ ok: true });
    }
};
exports.StripeGatewayAdapter = StripeGatewayAdapter;
exports.StripeGatewayAdapter = StripeGatewayAdapter = StripeGatewayAdapter_1 = __decorate([
    (0, common_1.Injectable)()
], StripeGatewayAdapter);
//# sourceMappingURL=stripe.adapter.js.map