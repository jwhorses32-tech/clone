import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { TenantGuard } from '../common/guards/tenant.guard';
import { CurrentTenant } from '../common/decorators/current-tenant.decorator';
import type { TenantContext } from '../common/decorators/current-tenant.decorator';
import { MerchantGatewaysService } from './merchant-gateways.service';
import { ConnectGatewayDto } from './dto/connect-gateway.dto';

@Controller('tenants/gateways')
@UseGuards(JwtAuthGuard, TenantGuard)
export class MerchantGatewaysController {
  constructor(private readonly svc: MerchantGatewaysService) {}

  @Get()
  list(@CurrentTenant() t: TenantContext | undefined) {
    return this.svc.list(t!.tenantId);
  }

  @Post('connect')
  connect(
    @CurrentTenant() t: TenantContext | undefined,
    @Body() dto: ConnectGatewayDto,
  ) {
    return this.svc.connect(t!.tenantId, dto.gatewayCode, dto.credentials);
  }
}
