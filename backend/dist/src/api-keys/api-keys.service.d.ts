import { PrismaService } from '../prisma/prisma.service';
export declare class ApiKeysService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    list(tenantId: string): Promise<{
        id: string;
        createdAt: Date;
        name: string | null;
        publicKey: string;
        scopes: string[];
        lastUsedAt: Date | null;
    }[]>;
    create(tenantId: string, name?: string): Promise<{
        publicKey: string;
        secretKey: string;
    }>;
    revoke(tenantId: string, id: string): Promise<{
        id: string;
        createdAt: Date;
        name: string | null;
        publicKey: string;
        tenantId: string;
        secretHash: string;
        scopes: string[];
        lastUsedAt: Date | null;
        revokedAt: Date | null;
    }>;
}
