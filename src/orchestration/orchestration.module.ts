import { Module } from '@nestjs/common';
import { IdempotencyService } from './idempotency.service';
import { RouterService } from './router.service';
import { FailoverService } from './failover.service';
import { GatewaysModule } from '../gateways/gateways.module';

@Module({
  imports: [GatewaysModule],
  providers: [IdempotencyService, RouterService, FailoverService],
  exports: [IdempotencyService, RouterService, FailoverService],
})
export class OrchestrationModule {}
