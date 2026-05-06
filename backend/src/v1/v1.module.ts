import { Module } from '@nestjs/common';
import { V1Controller } from './v1.controller';
import { InvoicesModule } from '../invoices/invoices.module';

@Module({
  imports: [InvoicesModule],
  controllers: [V1Controller],
})
export class V1Module {}
