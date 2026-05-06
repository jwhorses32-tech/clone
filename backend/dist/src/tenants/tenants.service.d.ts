import { PrismaService } from '../prisma/prisma.service';
import { EncryptionService } from '../common/encryption.service';
export declare class TenantsService {
    private readonly prisma;
    private readonly encryption;
    constructor(prisma: PrismaService, encryption: EncryptionService);
    listForUser(userId: string): Promise<({
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
    create(userId: string, brandSlug: string, displayName: string): Promise<{
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
    setStatus(tenantId: string, status: 'PENDING' | 'ACTIVE' | 'SUSPENDED'): Promise<{
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
    approveKyc(tenantId: string): Promise<{
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
