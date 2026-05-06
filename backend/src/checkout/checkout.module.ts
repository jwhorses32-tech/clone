import { Module } from '@nestjs/common';
import { CheckoutController } from './checkout.controller';
import { InvoicesModule } from '../invoices/invoices.module';
import { TransactionsModule } from '../transactions/transactions.module';

@Module({
  imports: [InvoicesModule, TransactionsModule],
  controllers: [CheckoutController],
})
export class CheckoutModule {}
