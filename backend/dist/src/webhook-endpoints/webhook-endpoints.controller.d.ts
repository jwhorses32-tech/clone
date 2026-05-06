import type { TenantContext } from '../common/decorators/current-tenant.decorator';
import { PrismaService } from '../prisma/prisma.service';
import { CreateWebhookEndpointDto } from './dto/create-webhook-endpoint.dto';
export declare class WebhookEndpointsController {
    private readonly prisma;
    constructor(prisma: PrismaService);
    list(t: TenantContext | undefined): import("@prisma/client").Prisma.PrismaPromise<{
        url: string;
        id: string;
        isActive: boolean;
        createdAt: Date;
        events: string[];
    }[]>;
    create(t: TenantContext | undefined, dto: CreateWebhookEndpointDto): Promise<{
        url: string;
        id: string;
        createdAt: Date;
        secret: string;
        events: string[];
    }>;
}
