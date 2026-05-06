import { PrismaService } from '../prisma/prisma.service';
import { TenantsService } from '../tenants/tenants.service';
import { GatewayRegistryService } from '../gateways/gateway-registry.service';
import { RiskService } from '../risk/risk.service';
import { BlocklistType, TenantStatus } from '@prisma/client';
declare class UpdateTenantAdminDto {
    status?: TenantStatus;
}
declare class GlobalBlocklistDto {
    type: BlocklistType;
    value: string;
    reason?: string;
}
export declare class AdminController {
    private readonly prisma;
    private readonly tenants;
    private readonly gateways;
    private readonly risk;
    constructor(prisma: PrismaService, tenants: TenantsService, gateways: GatewayRegistryService, risk: RiskService);
    listTenants(): import("@prisma/client").Prisma.PrismaPromise<({
        memberships: ({
            user: {
                email: string;
            };
        } & {
            id: string;
            role: import("@prisma/client").$Enums.MembershipRole;
            createdAt: Date;
            userId: string;
            tenantId: string;
        })[];
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
    updateTenant(id: string, dto: UpdateTenantAdminDto): import("@prisma/client").Prisma.Prisma__TenantClient<{
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
    } | null, null, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions> | Promise<{
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
    kyc(id: string): Promise<{
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
    gatewaysHealth(): Promise<{
        gateways: {
            ok: boolean;
            message?: string;
            code: string;
        }[];
    }>;
    addGlobalBlocklist(body: GlobalBlocklistDto): Promise<{
        id: string;
        createdAt: Date;
        type: import("@prisma/client").$Enums.BlocklistType;
        tenantId: string | null;
        value: string;
        reason: string | null;
        expiresAt: Date | null;
    }>;
}
export {};
