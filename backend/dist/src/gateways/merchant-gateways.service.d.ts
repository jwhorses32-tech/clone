import { PrismaService } from '../prisma/prisma.service';
import { EncryptionService } from '../common/encryption.service';
import { GatewayRegistryService } from './gateway-registry.service';
export declare class MerchantGatewaysService {
    private readonly prisma;
    private readonly encryption;
    private readonly registry;
    constructor(prisma: PrismaService, encryption: EncryptionService, registry: GatewayRegistryService);
    list(tenantId: string): Promise<({
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
        updatedAt: Date;
        status: string;
        encryptedCreds: string;
        weight: number;
        successRate: number;
        costFactor: number;
        tenantId: string;
        gatewayId: string;
    })[]>;
    connect(tenantId: string, gatewayCode: string, credentials: Record<string, unknown>): Promise<{
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
        updatedAt: Date;
        status: string;
        encryptedCreds: string;
        weight: number;
        successRate: number;
        costFactor: number;
        tenantId: string;
        gatewayId: string;
    }>;
    decryptCredentials(encryptedCreds: string): Record<string, unknown>;
}
