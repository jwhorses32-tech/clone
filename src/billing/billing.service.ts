import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BillingService {
  constructor(private readonly prisma: PrismaService) {}

  listPlans() {
    return this.prisma.plan.findMany({ orderBy: { sortOrder: 'asc' } });
  }

  async subscribe(tenantId: string, planSlug: string) {
    const plan = await this.prisma.plan.findUnique({
      where: { slug: planSlug },
    });
    if (!plan) throw new NotFoundException('Plan not found');

    await this.prisma.subscription.create({
      data: {
        tenantId,
        planId: plan.id,
        status: 'ACTIVE',
        depositPaidAt: new Date(),
      },
    });
    await this.prisma.tenant.update({
      where: { id: tenantId },
      data: { planId: plan.id, depositCents: plan.depositCents },
    });
    return { ok: true, plan };
  }

  async recordDeposit(
    tenantId: string,
    amountCents: number,
    stripePaymentIntentId?: string,
  ) {
    return this.prisma.securityDeposit.create({
      data: { tenantId, amountCents, stripePaymentIntentId, status: 'paid' },
    });
  }
}
