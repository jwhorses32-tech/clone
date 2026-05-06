import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RouterService } from '../orchestration/router.service';
import { FailoverService } from '../orchestration/failover.service';
import { RiskService } from '../risk/risk.service';
import { OutboundWebhooksService } from '../webhooks/outbound-webhooks.service';

@Injectable()
export class TransactionsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly router: RouterService,
    private readonly failover: FailoverService,
    private readonly risk: RiskService,
    private readonly outbound: OutboundWebhooksService,
  ) {}

  async listForTenant(tenantId: string, take = 50) {
    return this.prisma.paymentTransaction.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
      take,
      include: { attempts: { include: { gateway: true } }, invoice: true },
    });
  }

  async getOne(tenantId: string, id: string) {
    const tx = await this.prisma.paymentTransaction.findFirst({
      where: { id, tenantId },
      include: { attempts: { include: { gateway: true } }, invoice: true },
    });
    if (!tx) throw new NotFoundException();
    return tx;
  }

  async processHostedCheckout(
    hostedPath: string,
    body: { email?: string; deviceFingerprint?: string },
    ip?: string,
  ) {
    const link = await this.prisma.paymentLink.findUnique({
      where: { hostedPath },
      include: { invoice: true, tenant: true },
    });
    if (!link || link.status !== 'ACTIVE')
      throw new NotFoundException('Invalid payment link');

    const risk = await this.risk.isBlocked(link.tenantId, {
      email: body.email,
      deviceFingerprint: body.deviceFingerprint,
      ip,
    });
    if (risk.blocked) {
      throw new ForbiddenException({
        message: 'Risk blocked',
        reason: risk.reason,
      });
    }

    const tx = link.invoiceId
      ? await this.prisma.paymentTransaction.findFirst({
          where: { tenantId: link.tenantId, invoiceId: link.invoiceId },
          orderBy: { createdAt: 'desc' },
        })
      : await this.prisma.paymentTransaction.findFirst({
          where: { tenantId: link.tenantId, status: 'CREATED' },
          orderBy: { createdAt: 'desc' },
        });
    if (!tx) throw new BadRequestException('No transaction for this link');

    await this.prisma.paymentTransaction.update({
      where: { id: tx.id },
      data: { status: 'ROUTING' },
    });

    const gateways = await this.router.routeForTenant(link.tenantId);
    if (!gateways.length) {
      throw new BadRequestException(
        'No payment gateways configured for this merchant',
      );
    }

    const gatewayRowCache = new Map<string, string>();
    const getGatewayDbId = async (code: string) => {
      if (gatewayRowCache.has(code)) return gatewayRowCache.get(code)!;
      const g = await this.prisma.gateway.findUniqueOrThrow({
        where: { code },
      });
      gatewayRowCache.set(code, g.id);
      return g.id;
    };

    const outcome = await this.failover.executeWithFailover(
      gateways,
      async (g) => {
        const start = Date.now();
        const res = await g.adapter.authorize({
          amountCents: link.amountCents,
          currency: link.currency,
          credentials: g.credentials,
          metadata: {
            hostedPath,
            invoiceId: link.invoiceId ?? '',
            orderRef: link.invoice?.orderReference ?? '',
          },
        });
        const gatewayDbId = await getGatewayDbId(g.gatewayCode);
        await this.prisma.paymentTransactionAttempt.create({
          data: {
            transactionId: tx.id,
            gatewayId: gatewayDbId,
            status: res.success ? 'SUCCEEDED' : 'FAILED',
            gatewayRef: res.gatewayRef,
            latencyMs: res.latencyMs ?? Date.now() - start,
            errorCode: res.errorCode,
            rawResponse: (res.raw as object) ?? undefined,
          },
        });
        return { ok: res.success, result: res, error: res.errorCode };
      },
    );

    if (!outcome.ok) {
      await this.prisma.paymentTransaction.update({
        where: { id: tx.id },
        data: { status: 'FAILED' },
      });
      throw new BadRequestException({
        message: 'all_gateways_failed',
        errors: outcome.errors,
      });
    }

    await this.prisma.paymentTransaction.update({
      where: { id: tx.id },
      data: {
        status: 'SETTLED',
        customerFingerprint: body.deviceFingerprint ?? undefined,
      },
    });

    if (link.invoiceId) {
      await this.prisma.invoice.update({
        where: { id: link.invoiceId },
        data: { status: 'PAID' },
      });
    }

    await this.prisma.paymentLink.update({
      where: { id: link.id },
      data: { status: 'USED' },
    });

    await this.prisma.tenant.update({
      where: { id: link.tenantId },
      data: { monthlyVolumeCents: { increment: link.amountCents } },
    });

    const inv = link.invoice;
    if (inv?.webhookUrl) {
      void fetch(inv.webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'invoice.paid',
          data: { invoice_id: inv.id, amount_cents: link.amountCents },
        }),
      }).catch(() => undefined);
    }

    await this.outbound.dispatch(link.tenantId, 'invoice.paid', {
      invoice_id: link.invoiceId,
      transaction_id: tx.id,
      amount_cents: link.amountCents,
    });

    return { ok: true, transaction_id: tx.id };
  }
}
