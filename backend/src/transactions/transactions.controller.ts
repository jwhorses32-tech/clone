import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { TenantGuard } from '../common/guards/tenant.guard';
import { CurrentTenant } from '../common/decorators/current-tenant.decorator';
import type { TenantContext } from '../common/decorators/current-tenant.decorator';
import { TransactionsService } from './transactions.service';

@Controller('tenants/transactions')
@UseGuards(JwtAuthGuard, TenantGuard)
export class TransactionsController {
  constructor(private readonly svc: TransactionsService) {}

  @Get()
  list(@CurrentTenant() t: TenantContext | undefined) {
    return this.svc.listForTenant(t!.tenantId);
  }

  @Get(':id')
  one(@CurrentTenant() t: TenantContext | undefined, @Param('id') id: string) {
    return this.svc.getOne(t!.tenantId, id);
  }
}
