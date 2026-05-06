import { Injectable, Logger } from '@nestjs/common';
import Stripe from 'stripe';
import type {
  AuthorizeContext,
  AuthorizeResult,
  CaptureContext,
  GatewayAdapter,
  RefundContext,
} from '../interfaces/gateway-adapter.interface';

/** Keep in sync with installed stripe package OpenAPI binding */
const STRIPE_API_VERSION = '2026-04-22.dahlia' as const;

function pickStripeSecret(creds: Record<string, unknown>): string {
  const a = creds['secretKey'];
  const b = creds['stripeSecretKey'];
  if (typeof a === 'string') return a;
  if (typeof b === 'string') return b;
  return '';
}

@Injectable()
export class StripeGatewayAdapter implements GatewayAdapter {
  readonly code = 'stripe';
  private readonly logger = new Logger(StripeGatewayAdapter.name);

  async authorize(ctx: AuthorizeContext): Promise<AuthorizeResult> {
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
      const stripe = new Stripe(secret, { apiVersion: STRIPE_API_VERSION });
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
    } catch (e) {
      this.logger.warn(`Stripe authorize failed: ${(e as Error).message}`);
      return {
        success: false,
        errorCode: 'stripe_error',
        latencyMs: Date.now() - start,
        raw: String(e),
      };
    }
  }

  async capture(ctx: CaptureContext): Promise<AuthorizeResult> {
    const secret = pickStripeSecret(ctx.credentials);
    const stripe = new Stripe(secret, { apiVersion: STRIPE_API_VERSION });
    const pi = await stripe.paymentIntents.capture(ctx.gatewayRef);
    return { success: pi.status === 'succeeded', gatewayRef: pi.id, raw: pi };
  }

  async refund(ctx: RefundContext): Promise<AuthorizeResult> {
    const secret = pickStripeSecret(ctx.credentials);
    const stripe = new Stripe(secret, { apiVersion: STRIPE_API_VERSION });
    const r = await stripe.refunds.create({
      payment_intent: ctx.gatewayRef,
      amount: ctx.amountCents,
    });
    return { success: true, gatewayRef: r.id, raw: r };
  }

  async void(ctx: CaptureContext): Promise<AuthorizeResult> {
    const secret = pickStripeSecret(ctx.credentials);
    const stripe = new Stripe(secret, { apiVersion: STRIPE_API_VERSION });
    await stripe.paymentIntents.cancel(ctx.gatewayRef);
    return { success: true, gatewayRef: ctx.gatewayRef };
  }

  verifyWebhook(
    payload: string | Buffer,
    signature: string | undefined,
    secret: string,
  ): boolean {
    if (!signature) return false;
    try {
      Stripe.webhooks.constructEvent(payload, signature, secret);
      return true;
    } catch {
      return false;
    }
  }

  getHealth(): Promise<{ ok: boolean; message?: string }> {
    return Promise.resolve({ ok: true });
  }
}
