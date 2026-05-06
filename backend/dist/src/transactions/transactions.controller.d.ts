import type { TenantContext } from '../common/decorators/current-tenant.decorator';
import { TransactionsService } from './transactions.service';
export declare class TransactionsController {
    private readonly svc;
    constructor(svc: TransactionsService);
    list(t: TenantContext | undefined): Promise<({
        invoice: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import("@prisma/client").$Enums.InvoiceStatus;
            tenantId: string;
            expiresAt: Date | null;
            amountCents: number;
            currency: string;
            orderReference: string;
            webhookUrl: string | null;
        } | null;
        attempts: ({
            gateway: {
                id: string;
                displayName: string;
                isActive: boolean;
                code: string;
                capabilities: string[];
            };
        } & {
            id: string;
            createdAt: Date;
            status: import("@prisma/client").$Enums.AttemptStatus;
            latencyMs: number | null;
            gatewayId: string;
            errorCode: string | null;
            gatewayRef: string | null;
            rawResponse: import("@prisma/client/runtime/client").JsonValue | null;
            transactionId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.MerchantPaymentStatus;
        tenantId: string;
        invoiceId: string | null;
        amountCents: number;
        currency: string;
        customerFingerprint: string | null;
        riskScore: number | null;
        idempotencyKey: string | null;
    })[]>;
    one(t: TenantContext | undefined, id: string): Promise<{
        invoice: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import("@prisma/client").$Enums.InvoiceStatus;
            tenantId: string;
            expiresAt: Date | null;
            amountCents: number;
            currency: string;
            orderReference: string;
            webhookUrl: string | null;
        } | null;
        attempts: ({
            gateway: {
                id: string;
                displayName: string;
                isActive: boolean;
                code: string;
                capabilities: string[];
            };
        } & {
            id: string;
            createdAt: Date;
            status: import("@prisma/client").$Enums.AttemptStatus;
            latencyMs: number | null;
            gatewayId: string;
            errorCode: string | null;
            gatewayRef: string | null;
            rawResponse: import("@prisma/client/runtime/client").JsonValue | null;
            transactionId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.MerchantPaymentStatus;
        tenantId: string;
        invoiceId: string | null;
        amountCents: number;
        currency: string;
        customerFingerprint: string | null;
        riskScore: number | null;
        idempotencyKey: string | null;
    }>;
}
