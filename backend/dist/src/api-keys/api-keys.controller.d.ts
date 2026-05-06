import type { TenantContext } from '../common/decorators/current-tenant.decorator';
import { ApiKeysService } from './api-keys.service';
declare class CreateApiKeyDto {
    name?: string;
}
export declare class ApiKeysController {
    private readonly svc;
    constructor(svc: ApiKeysService);
    list(t: TenantContext | undefined): Promise<{
        id: string;
        createdAt: Date;
        name: string | null;
        publicKey: string;
        scopes: string[];
        lastUsedAt: Date | null;
    }[]>;
    create(t: TenantContext | undefined, dto: CreateApiKeyDto): Promise<{
        publicKey: string;
        secretKey: string;
    }>;
    revoke(t: TenantContext | undefined, id: string): Promise<{
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
export {};
