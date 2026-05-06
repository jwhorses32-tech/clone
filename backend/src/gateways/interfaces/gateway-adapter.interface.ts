export type AuthorizeContext = {
  amountCents: number;
  currency: string;
  idempotencyKey?: string;
  metadata?: Record<string, string>;
  credentials: Record<string, unknown>;
};

export type AuthorizeResult = {
  success: boolean;
  gatewayRef?: string;
  errorCode?: string;
  latencyMs?: number;
  raw?: unknown;
};

export type CaptureContext = AuthorizeContext & { gatewayRef: string };
export type RefundContext = AuthorizeContext & {
  gatewayRef: string;
  amountCents: number;
};

export interface GatewayAdapter {
  readonly code: string;
  authorize(ctx: AuthorizeContext): Promise<AuthorizeResult>;
  capture(ctx: CaptureContext): Promise<AuthorizeResult>;
  refund(ctx: RefundContext): Promise<AuthorizeResult>;
  void(ctx: CaptureContext): Promise<AuthorizeResult>;
  verifyWebhook(
    payload: string | Buffer,
    signature: string | undefined,
    secret: string,
  ): boolean;
  getHealth(): Promise<{ ok: boolean; message?: string }>;
}
