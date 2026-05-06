import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { PrismaService } from '../prisma/prisma.service';
import { TenantsService } from '../tenants/tenants.service';
import { GatewayRegistryService } from '../gateways/gateway-registry.service';
import { RiskService } from '../risk/risk.service';
import { IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { BlocklistType, TenantStatus } from '@prisma/client';

class UpdateTenantAdminDto {
  @IsOptional()
  @IsEnum(TenantStatus)
  status?: TenantStatus;
}

class GlobalBlocklistDto {
  @IsEnum(BlocklistType)
  type!: BlocklistType;

  @IsString()
  @MinLength(2)
  value!: string;

  @IsOptional()
  @IsString()
  reason?: string;
}

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN', 'STAFF')
export class AdminController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tenants: TenantsService,
    private readonly gateways: GatewayRegistryService,
    private readonly risk: RiskService,
  ) {}

  @Get('tenants')
  listTenants() {
    return this.prisma.tenant.findMany({
      orderBy: { createdAt: 'desc' },
      take: 200,
      include: {
        plan: true,
        memberships: { include: { user: { select: { email: true } } } },
      },
    });
  }

  @Patch('tenants/:id')
  updateTenant(@Param('id') id: string, @Body() dto: UpdateTenantAdminDto) {
    if (dto.status) return this.tenants.setStatus(id, dto.status);
    return this.prisma.tenant.findUnique({ where: { id } });
  }

  @Patch('tenants/:id/kyc-approve')
  kyc(@Param('id') id: string) {
    return this.tenants.approveKyc(id);
  }

  @Get('gateways/health')
  async gatewaysHealth() {
    const adapters = this.gateways.list();
    const results = await Promise.all(
      adapters.map(async (a) => ({ code: a.code, ...(await a.getHealth()) })),
    );
    return { gateways: results };
  }

  @Post('risk/blocklist/global')
  addGlobalBlocklist(@Body() body: GlobalBlocklistDto) {
    return this.risk.addBlocklist(null, body.type, body.value, body.reason);
  }
}
