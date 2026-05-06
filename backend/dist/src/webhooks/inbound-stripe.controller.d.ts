import { PrismaService } from '../prisma/prisma.service';
import { GatewayRegistryService } from '../gateways/gateway-registry.service';
export declare class InboundStripeController {
    private readonly prisma;
    private readonly registry;
    constructor(prisma: PrismaService, registry: GatewayRegistryService);
    receive(signature: string | undefined, body: {
        type?: string;
        data?: {
            object?: {
                id?: string;
            };
        };
    }): {
        received: boolean;
    };
}
