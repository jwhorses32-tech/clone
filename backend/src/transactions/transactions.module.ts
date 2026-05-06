import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { OrchestrationModule } from '../orchestration/orchestration.module';
import { RiskModule } from '../risk/risk.module';
import { WebhooksModule } from '../webhooks/webhooks.module';

@Module({
  imports: [OrchestrationModule, RiskModule, WebhooksModule],
  controllers: [TransactionsController],
  providers: [TransactionsService],
  exports: [TransactionsService],
})
export class TransactionsModule {}
