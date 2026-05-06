import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  async summary(tenantId: string) {
    const settled = await this.prisma.paymentTransaction.findMany({
      where: { tenantId, status: 'SETTLED' },
      select: { amountCents: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
      take: 1000,
    });
    const volume = settled.reduce((a, t) => a + t.amountCents, 0);
    const failed = await this.prisma.paymentTransaction.count({
      where: { tenantId, status: 'FAILED' },
    });
    return {
      settled_count: settled.length,
      volume_cents_sampled: volume,
      failed_count: failed,
    };
  }
}
