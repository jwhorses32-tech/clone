import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { TenantGuard } from '../common/guards/tenant.guard';
import { CurrentTenant } from '../common/decorators/current-tenant.decorator';
import type { TenantContext } from '../common/decorators/current-tenant.decorator';
import { BillingService } from './billing.service';
import { IsString, MinLength } from 'class-validator';

class SubscribeDto {
  @IsString()
  @MinLength(2)
  planSlug!: string;
}

@Controller('billing')
export class BillingController {
  constructor(private readonly billing: BillingService) {}

  @Get('plans')
  plans() {
    return this.billing.listPlans();
  }

  @UseGuards(JwtAuthGuard, TenantGuard)
  @Post('subscribe')
  subscribe(
    @CurrentTenant() t: TenantContext | undefined,
    @Body() dto: SubscribeDto,
  ) {
    return this.billing.subscribe(t!.tenantId, dto.planSlug);
  }
}
