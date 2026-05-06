import { PrismaService } from '../prisma/prisma.service';
export declare class BillingService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    listPlans(): import("@prisma/client").Prisma.PrismaPromise<{
        id: string;
        name: string;
        depositCents: number;
        slug: string;
        monthlyVolumeMinCents: number;
        monthlyVolumeMaxCents: number | null;
        sortOrder: number;
    }[]>;
    subscribe(tenantId: string, planSlug: string): Promise<{
        ok: boolean;
        plan: {
            id: string;
            name: string;
            depositCents: number;
            slug: string;
            monthlyVolumeMinCents: number;
            monthlyVolumeMaxCents: number | null;
            sortOrder: number;
        };
    }>;
    recordDeposit(tenantId: string, amountCents: number, stripePaymentIntentId?: string): Promise<{
        id: string;
        createdAt: Date;
        status: string;
        tenantId: string;
        amountCents: number;
        currency: string;
        stripePaymentIntentId: string | null;
        refundedAt: Date | null;
    }>;
}
