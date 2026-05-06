import { PrismaService } from '../prisma/prisma.service';
export declare class OutboundWebhooksService {
    private readonly prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    dispatch(tenantId: string, eventType: string, payload: Record<string, unknown>): Promise<void>;
    private deliverWithRetries;
}
