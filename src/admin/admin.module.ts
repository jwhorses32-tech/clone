import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { TenantsModule } from '../tenants/tenants.module';
import { GatewaysModule } from '../gateways/gateways.module';
import { RiskModule } from '../risk/risk.module';

@Module({
  imports: [TenantsModule, GatewaysModule, RiskModule],
  controllers: [AdminController],
})
export class AdminModule {}
