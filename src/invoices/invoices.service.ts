import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomBytes } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';

export type CreateInvoiceApiInput = {
  /** Amount in smallest currency unit (e.g. USD cents) */
  amount: number;
  brand_slug: string;
  order_reference: string;
  webhook_url?: string;
  idempotency_key?: string;
};

@Injectable()
export class InvoicesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  private paymentUrl(hostedPath: string): string {
    const base = this.config.get<string>(
      'FRONTEND_URL',
      'http://localhost:3000',
    );
    return `${base}/pay/${hostedPath}`;
  }

  async createFromApi(tenantId: string, input: CreateInvoiceApiInput) {
    const tenant = await this.prisma.tenant.findFirst({
      where: { id: tenantId, brandSlug: input.brand_slug },
    });
    if (!tenant) {
      throw new ForbiddenException('brand_slug does not match this API key');
    }

    if (input.idempotency_key) {
      const existingTx = await this.prisma.paymentTransaction.findFirst({
        where: { tenantId, idempotencyKey: input.idempotency_key },
        include: { invoice: true },
      });
      if (existingTx?.invoice) {
        const link = await this.prisma.paymentLink.findFirst({
          where: { invoiceId: existingTx.invoice.id },
        });
        if (link) {
          return {
            data: {
              invoice_id: existingTx.invoice.id,
              payment_url: this.paymentUrl(link.hostedPath),
              expires_at: existingTx.invoice.expiresAt?.toISOString() ?? null,
            },
          };
        }
      }
    }

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const invoice = await this.prisma.invoice.create({
      data: {
        tenantId,
        orderReference: input.order_reference,
        amountCents: input.amount,
        currency: 'USD',
        status: 'OPEN',
        webhookUrl: input.webhook_url,
        expiresAt,
      },
    });

    const hostedPath = randomBytes(18).toString('base64url');
    const link = await this.prisma.paymentLink.create({
      data: {
        tenantId,
        invoiceId: invoice.id,
        amountCents: input.amount,
        currency: 'USD',
        status: 'ACTIVE',
        hostedPath,
        expiresAt,
      },
    });

    const tx = await this.prisma.paymentTransaction.create({
      data: {
        tenantId,
        invoiceId: invoice.id,
        amountCents: input.amount,
        currency: 'USD',
        status: 'CREATED',
        idempotencyKey: input.idempotency_key ?? null,
      },
    });

    return {
      data: {
        invoice_id: invoice.id,
        transaction_id: tx.id,
        payment_url: this.paymentUrl(link.hostedPath),
        expires_at: expiresAt.toISOString(),
      },
    };
  }

  async getPublicCheckout(hostedPath: string) {
    const link = await this.prisma.paymentLink.findUnique({
      where: { hostedPath },
      include: { tenant: true, invoice: true },
    });
    if (!link || link.status !== 'ACTIVE') {
      throw new NotFoundException('Payment link not found');
    }
    return {
      amount_cents: link.amountCents,
      currency: link.currency,
      brand: link.tenant.displayName,
      order_reference: link.invoice?.orderReference ?? null,
    };
  }
}
