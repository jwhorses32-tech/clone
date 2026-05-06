import { Injectable } from '@nestjs/common';
import type {
  AuthorizeContext,
  AuthorizeResult,
  CaptureContext,
  GatewayAdapter,
  RefundContext,
} from '../interfaces/gateway-adapter.interface';

/** Stub for Coinbase Commerce — returns a pseudo charge id for orchestration demos. */
@Injectable()
export class CoinbaseGatewayAdapter implements GatewayAdapter {
  readonly code = 'coinbase';

  authorize(ctx: AuthorizeContext): Promise<AuthorizeResult> {
    return Promise.resolve({
      success: true,
      gatewayRef: `coinbase_stub_${ctx.amountCents}_${Date.now()}`,
      raw: { hostedUrl: 'https://commerce.coinbase.com/charges/demo' },
    });
  }

  capture(ctx: CaptureContext): Promise<AuthorizeResult> {
    return Promise.resolve({ success: true, gatewayRef: ctx.gatewayRef });
  }

  refund(ctx: RefundContext): Promise<AuthorizeResult> {
    return Promise.resolve({ success: true, gatewayRef: ctx.gatewayRef });
  }

  void(ctx: CaptureContext): Promise<AuthorizeResult> {
    return Promise.resolve({ success: true, gatewayRef: ctx.gatewayRef });
  }

  verifyWebhook(): boolean {
    return true;
  }

  getHealth(): Promise<{ ok: boolean; message?: string }> {
    return Promise.resolve({ ok: true, message: 'coinbase_stub' });
  }
}
