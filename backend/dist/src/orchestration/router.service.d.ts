import { PrismaService } from '../prisma/prisma.service';
import type { GatewayAdapter } from '../gateways/interfaces/gateway-adapter.interface';
import { GatewayRegistryService } from '../gateways/gateway-registry.service';
import { MerchantGatewaysService } from '../gateways/merchant-gateways.service';
export type RoutedGateway = {
    merchantGatewayId: string;
    gatewayCode: string;
    adapter: GatewayAdapter;
    credentials: Record<string, unknown>;
    score: number;
};
export declare class RouterService {
    private readonly prisma;
    private readonly registry;
    private readonly merchantGateways;
    constructor(prisma: PrismaService, registry: GatewayRegistryService, merchantGateways: MerchantGatewaysService);
    routeForTenant(tenantId: string): Promise<RoutedGateway[]>;
}
