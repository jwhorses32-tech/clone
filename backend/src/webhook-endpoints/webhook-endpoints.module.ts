import { Module } from '@nestjs/common';
import { WebhookEndpointsController } from './webhook-endpoints.controller';

@Module({
  controllers: [WebhookEndpointsController],
})
export class WebhookEndpointsModule {}
