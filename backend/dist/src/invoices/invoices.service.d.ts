import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
export type CreateInvoiceApiInput = {
    amount: number;
    brand_slug: string;
    order_reference: string;
    webhook_url?: string;
    idempotency_key?: string;
};
export declare class InvoicesService {
    private readonly prisma;
    private readonly config;
    constructor(prisma: PrismaService, config: ConfigService);
    private paymentUrl;
    createFromApi(tenantId: string, input: CreateInvoiceApiInput): Promise<{
        data: {
            invoice_id: string;
            payment_url: string;
            expires_at: string | null;
            transaction_id?: undefined;
        };
    } | {
        data: {
            invoice_id: string;
            transaction_id: string;
            payment_url: string;
            expires_at: string;
        };
    }>;
    getPublicCheckout(hostedPath: string): Promise<{
        amount_cents: number;
        currency: string;
        brand: string;
        order_reference: string | null;
    }>;
}
