import type { AuthorizeContext, AuthorizeResult, CaptureContext, GatewayAdapter, RefundContext } from '../interfaces/gateway-adapter.interface';
export declare class CoinbaseGatewayAdapter implements GatewayAdapter {
    readonly code = "coinbase";
    authorize(ctx: AuthorizeContext): Promise<AuthorizeResult>;
    capture(ctx: CaptureContext): Promise<AuthorizeResult>;
    refund(ctx: RefundContext): Promise<AuthorizeResult>;
    void(ctx: CaptureContext): Promise<AuthorizeResult>;
    verifyWebhook(): boolean;
    getHealth(): Promise<{
        ok: boolean;
        message?: string;
    }>;
}
