import type { TenantContext } from '../common/decorators/current-tenant.decorator';
import { BillingService } from './billing.service';
declare class SubscribeDto {
    planSlug: string;
}
export declare class BillingController {
    private readonly billing;
    constructor(billing: BillingService);
    plans(): import("@prisma/client").Prisma.PrismaPromise<{
        id: string;
        name: string;
        depositCents: number;
        slug: string;
        monthlyVolumeMinCents: number;
        monthlyVolumeMaxCents: number | null;
        sortOrder: number;
    }[]>;
    subscribe(t: TenantContext | undefined, dto: SubscribeDto): Promise<{
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
}
export {};
