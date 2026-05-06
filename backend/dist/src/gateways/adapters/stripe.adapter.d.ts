import type { AuthorizeContext, AuthorizeResult, CaptureContext, GatewayAdapter, RefundContext } from '../interfaces/gateway-adapter.interface';
export declare class StripeGatewayAdapter implements GatewayAdapter {
    readonly code = "stripe";
    private readonly logger;
    authorize(ctx: AuthorizeContext): Promise<AuthorizeResult>;
    capture(ctx: CaptureContext): Promise<AuthorizeResult>;
    refund(ctx: RefundContext): Promise<AuthorizeResult>;
    void(ctx: CaptureContext): Promise<AuthorizeResult>;
    verifyWebhook(payload: string | Buffer, signature: string | undefined, secret: string): boolean;
    getHealth(): Promise<{
        ok: boolean;
        message?: string;
    }>;
}
