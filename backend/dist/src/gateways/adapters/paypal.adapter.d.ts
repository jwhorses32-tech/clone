import type { AuthorizeContext, AuthorizeResult, CaptureContext, GatewayAdapter, RefundContext } from '../interfaces/gateway-adapter.interface';
export declare class PaypalGatewayAdapter implements GatewayAdapter {
    readonly code = "paypal";
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
