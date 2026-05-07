import { Body, Controller, Headers, Post } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GatewayRegistryService } from '../gateways/gateway-registry.service';

/** Dev-friendly JSON webhook receiver; production Stripe needs raw body + signature. */
@Controller('webhooks/stripe')
export class InboundStripeController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly registry: GatewayRegistryService,
  ) {}

  @Post()
  receive(
    @Headers('stripe-signature') signature: string | undefined,
    @Body() body: { type?: string; data?: { object?: { id?: string } } },
  ) {
    const adapter = this.registry.get('stripe');
    const secret = process.env.STRIPE_WEBHOOK_SECRET ?? 'whsec_dev';
    const raw = JSON.stringify(body);
    if (
      signature &&
      adapter &&
      !adapter.verifyWebhook(raw, signature, secret)
    ) {
      return { received: false };
    }
    void this.prisma.auditLog.create({
      data: {
        action: 'webhook.stripe',
        target: body.type ?? 'unknown',
        metadata: body,
      },
    });
    return { received: true };
  }
}
