import { PrismaService } from '../prisma/prisma.service';
import { RouterService } from '../orchestration/router.service';
import { FailoverService } from '../orchestration/failover.service';
import { RiskService } from '../risk/risk.service';
import { OutboundWebhooksService } from '../webhooks/outbound-webhooks.service';
export declare class TransactionsService {
    private readonly prisma;
    private readonly router;
    private readonly failover;
    private readonly risk;
    private readonly outbound;
    constructor(prisma: PrismaService, router: RouterService, failover: FailoverService, risk: RiskService, outbound: OutboundWebhooksService);
    listForTenant(tenantId: string, take?: number): Promise<({
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
    getOne(tenantId: string, id: string): Promise<{
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
    processHostedCheckout(hostedPath: string, body: {
        email?: string;
        deviceFingerprint?: string;
    }, ip?: string): Promise<{
        ok: boolean;
        transaction_id: string;
    }>;
}
