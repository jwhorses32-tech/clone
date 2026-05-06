import type { TenantContext } from '../common/decorators/current-tenant.decorator';
import { MerchantGatewaysService } from './merchant-gateways.service';
import { ConnectGatewayDto } from './dto/connect-gateway.dto';
export declare class MerchantGatewaysController {
    private readonly svc;
    constructor(svc: MerchantGatewaysService);
    list(t: TenantContext | undefined): Promise<({
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
    connect(t: TenantContext | undefined, dto: ConnectGatewayDto): Promise<{
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
}
