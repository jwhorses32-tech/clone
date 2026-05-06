import { Injectable } from '@nestjs/common';
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

@Injectable()
export class RouterService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly registry: GatewayRegistryService,
    private readonly merchantGateways: MerchantGatewaysService,
  ) {}

  /** Ordered list of gateways to try (best first). */
  async routeForTenant(tenantId: string): Promise<RoutedGateway[]> {
    const rows = await this.prisma.merchantGateway.findMany({
      where: { tenantId, status: 'active' },
      include: { gateway: true },
    });

    const scored: RoutedGateway[] = [];
    for (const row of rows) {
      const adapter = this.registry.get(row.gateway.code);
      if (!adapter) continue;
      const score =
        (row.successRate ?? 0.5) *
        (row.weight / 100) *
        (1 / Math.max(row.costFactor, 0.01));
      let credentials: Record<string, unknown> = {};
      try {
        credentials = this.merchantGateways.decryptCredentials(
          row.encryptedCreds,
        );
      } catch {
        continue;
      }
      scored.push({
        merchantGatewayId: row.id,
        gatewayCode: row.gateway.code,
        adapter,
        credentials,
        score,
      });
    }

    scored.sort((a, b) => b.score - a.score);
    return scored;
  }
}
