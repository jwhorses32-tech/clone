import { Injectable } from '@nestjs/common';
import type {
  AuthorizeContext,
  AuthorizeResult,
  CaptureContext,
  GatewayAdapter,
  RefundContext,
} from '../interfaces/gateway-adapter.interface';

/** Stub — replace with @paypal/paypal-server-sdk when wiring live PayPal. */
@Injectable()
export class PaypalGatewayAdapter implements GatewayAdapter {
  readonly code = 'paypal';

  authorize(ctx: AuthorizeContext): Promise<AuthorizeResult> {
    return Promise.resolve({
      success: true,
      gatewayRef: `paypal_stub_${ctx.amountCents}_${Date.now()}`,
      raw: { stub: true },
    });
  }

  capture(ctx: CaptureContext): Promise<AuthorizeResult> {
    return Promise.resolve({ success: true, gatewayRef: ctx.gatewayRef });
  }

  refund(ctx: RefundContext): Promise<AuthorizeResult> {
    return Promise.resolve({
      success: true,
      gatewayRef: ctx.gatewayRef,
      raw: { amount: ctx.amountCents },
    });
  }

  void(ctx: CaptureContext): Promise<AuthorizeResult> {
    return Promise.resolve({ success: true, gatewayRef: ctx.gatewayRef });
  }

  verifyWebhook(): boolean {
    return true;
  }

  getHealth(): Promise<{ ok: boolean; message?: string }> {
    return Promise.resolve({ ok: true, message: 'paypal_stub' });
  }
}
