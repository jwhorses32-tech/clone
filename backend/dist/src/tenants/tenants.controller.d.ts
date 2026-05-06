import type { JwtPayload } from '../auth/jwt-payload';
import { TenantsService } from './tenants.service';
import { CreateTenantDto } from './dto/create-tenant.dto';
export declare class TenantsController {
    private readonly tenants;
    constructor(tenants: TenantsService);
    list(user: JwtPayload | undefined): Promise<({
        plan: {
            id: string;
            name: string;
            depositCents: number;
            slug: string;
            monthlyVolumeMinCents: number;
            monthlyVolumeMaxCents: number | null;
            sortOrder: number;
        } | null;
    } & {
        id: string;
        displayName: string;
        createdAt: Date;
        updatedAt: Date;
        brandSlug: string;
        status: import("@prisma/client").$Enums.TenantStatus;
        planId: string | null;
        depositCents: number;
        monthlyVolumeCents: number;
        kycApprovedAt: Date | null;
    })[]>;
    create(user: JwtPayload | undefined, dto: CreateTenantDto): Promise<{
        id: string;
        displayName: string;
        createdAt: Date;
        updatedAt: Date;
        brandSlug: string;
        status: import("@prisma/client").$Enums.TenantStatus;
        planId: string | null;
        depositCents: number;
        monthlyVolumeCents: number;
        kycApprovedAt: Date | null;
    }>;
}
