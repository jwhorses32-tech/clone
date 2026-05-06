import { Injectable } from '@nestjs/common';
import type {
  AuthorizeContext,
  AuthorizeResult,
  CaptureContext,
  GatewayAdapter,
  RefundContext,
} from '../interfaces/gateway-adapter.interface';

@Injectable()
export class CashappGatewayAdapter implements GatewayAdapter {
  readonly code = 'cashapp';

  authorize(ctx: AuthorizeContext): Promise<AuthorizeResult> {
    return Promise.resolve({
      success: true,
      gatewayRef: `cashapp_stub_${ctx.amountCents}_${Date.now()}`,
      raw: { stub: true },
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
    return Promise.resolve({ ok: true, message: 'cashapp_stub' });
  }
}
