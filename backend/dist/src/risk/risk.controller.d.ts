import type { TenantContext } from '../common/decorators/current-tenant.decorator';
import { RiskService } from './risk.service';
import { AddBlocklistDto } from './dto/add-blocklist.dto';
import { GdprDeleteBlocklistDto } from './dto/gdpr-delete-blocklist.dto';
export declare class RiskController {
    private readonly risk;
    constructor(risk: RiskService);
    list(t: TenantContext | undefined): Promise<{
        id: string;
        createdAt: Date;
        type: import("@prisma/client").$Enums.BlocklistType;
        tenantId: string | null;
        value: string;
        reason: string | null;
        expiresAt: Date | null;
    }[]>;
    add(t: TenantContext | undefined, dto: AddBlocklistDto): Promise<{
        id: string;
        createdAt: Date;
        type: import("@prisma/client").$Enums.BlocklistType;
        tenantId: string | null;
        value: string;
        reason: string | null;
        expiresAt: Date | null;
    }>;
    remove(t: TenantContext | undefined, id: string): Promise<{
        ok: boolean;
    } | null>;
    gdprDelete(t: TenantContext | undefined, dto: GdprDeleteBlocklistDto): Promise<{
        count: number;
    }>;
}
