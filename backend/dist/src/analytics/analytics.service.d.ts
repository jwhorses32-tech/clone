import { PrismaService } from '../prisma/prisma.service';
export declare class AnalyticsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    summary(tenantId: string): Promise<{
        settled_count: number;
        volume_cents_sampled: number;
        failed_count: number;
    }>;
}
