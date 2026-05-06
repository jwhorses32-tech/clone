import { Injectable } from '@nestjs/common';
import type {
  AuthorizeContext,
  AuthorizeResult,
  CaptureContext,
  GatewayAdapter,
  RefundContext,
} from '../interfaces/gateway-adapter.interface';

@Injectable()
export class MockGatewayAdapter implements GatewayAdapter {
  readonly code = 'mock';

  async authorize(ctx: AuthorizeContext): Promise<AuthorizeResult> {
    const start = Date.now();
    const failRate = Number(
      (ctx.credentials['failRate'] as number | undefined) ?? 0,
    );
    const latencyMs = Number(
      (ctx.credentials['latencyMs'] as number | undefined) ?? 20,
    );
    if (latencyMs > 0)
      await new Promise((r) => setTimeout(r, Math.min(latencyMs, 2000)));
    const roll = Math.random();
    if (roll < failRate) {
      return {
        success: false,
        errorCode: 'mock_declined',
        latencyMs: Date.now() - start,
      };
    }
    return {
      success: true,
      gatewayRef: `mock_${Date.now()}`,
      latencyMs: Date.now() - start,
      raw: { mock: true },
    };
  }

  capture(ctx: CaptureContext): Promise<AuthorizeResult> {
    return Promise.resolve({
      success: true,
      gatewayRef: ctx.gatewayRef,
      raw: { captured: true },
    });
  }

  refund(ctx: RefundContext): Promise<AuthorizeResult> {
    return Promise.resolve({
      success: true,
      gatewayRef: ctx.gatewayRef,
      raw: { refunded: ctx.amountCents },
    });
  }

  void(ctx: CaptureContext): Promise<AuthorizeResult> {
    return Promise.resolve({ success: true, gatewayRef: ctx.gatewayRef });
  }

  verifyWebhook(): boolean {
    return true;
  }

  getHealth(): Promise<{ ok: boolean; message?: string }> {
    return Promise.resolve({ ok: true });
  }
}
