import { Module } from '@nestjs/common';
import { OutboundWebhooksService } from './outbound-webhooks.service';
import { InboundStripeController } from './inbound-stripe.controller';
import { GatewaysModule } from '../gateways/gateways.module';

@Module({
  imports: [GatewaysModule],
  controllers: [InboundStripeController],
  providers: [OutboundWebhooksService],
  exports: [OutboundWebhooksService],
})
export class WebhooksModule {}
