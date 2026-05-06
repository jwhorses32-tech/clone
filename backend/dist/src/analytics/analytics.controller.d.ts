import type { TenantContext } from '../common/decorators/current-tenant.decorator';
import { AnalyticsService } from './analytics.service';
export declare class AnalyticsController {
    private readonly svc;
    constructor(svc: AnalyticsService);
    summary(t: TenantContext | undefined): Promise<{
        settled_count: number;
        volume_cents_sampled: number;
        failed_count: number;
    }>;
}
