/**
 * Outbound webhooks: retries with exponential backoff.
 * For very high volume, replace the inline loop with BullMQ workers + Redis.
 */
import { Injectable, Logger } from '@nestjs/common';
import { createHmac, randomBytes } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OutboundWebhooksService {
  private readonly logger = new Logger(OutboundWebhooksService.name);

  constructor(private readonly prisma: PrismaService) {}

  async dispatch(
    tenantId: string,
    eventType: string,
    payload: Record<string, unknown>,
  ): Promise<void> {
    const endpoints = await this.prisma.webhookEndpoint.findMany({
      where: { tenantId, isActive: true },
    });

    for (const ep of endpoints) {
      if (
        ep.events.length &&
        !ep.events.includes('*') &&
        !ep.events.includes(eventType)
      ) {
        continue;
      }
      const eventId = randomBytes(16).toString('hex');
      const delivery = await this.prisma.webhookDelivery.create({
        data: {
          endpointId: ep.id,
          eventId,
          eventType,
          payload: { ...payload, event_id: eventId, type: eventType },
          lastStatus: 'PENDING',
        },
      });
      void this.deliverWithRetries(
        ep.url,
        ep.secret,
        delivery.id,
        eventType,
        payload,
        eventId,
      );
    }
  }

  private async deliverWithRetries(
    url: string,
    secret: string,
    deliveryId: string,
    eventType: string,
    payload: Record<string, unknown>,
    eventId: string,
  ): Promise<void> {
    const bodyObj = { id: eventId, type: eventType, data: payload };
    const body = JSON.stringify(bodyObj);
    const signature = createHmac('sha256', secret).update(body).digest('hex');

    for (let attempt = 1; attempt <= 5; attempt++) {
      try {
        const res = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Webhook-Signature': `sha256=${signature}`,
            'X-Webhook-Id': eventId,
          },
          body,
        });
        if (res.ok) {
          await this.prisma.webhookDelivery.update({
            where: { id: deliveryId },
            data: { lastStatus: 'SUCCESS', attempts: attempt, lastError: null },
          });
          return;
        }
        await this.prisma.webhookDelivery.update({
          where: { id: deliveryId },
          data: { attempts: attempt, lastError: `HTTP ${res.status}` },
        });
      } catch (e) {
        this.logger.warn(
          `Webhook delivery ${deliveryId} attempt ${attempt}: ${(e as Error).message}`,
        );
        await this.prisma.webhookDelivery.update({
          where: { id: deliveryId },
          data: { attempts: attempt, lastError: (e as Error).message },
        });
      }
      await new Promise((r) =>
        setTimeout(r, Math.min(1000 * 2 ** (attempt - 1), 30000)),
      );
    }
    await this.prisma.webhookDelivery.update({
      where: { id: deliveryId },
      data: { lastStatus: 'FAILED' },
    });
  }
}
