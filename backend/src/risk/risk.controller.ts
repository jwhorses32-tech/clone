import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { TenantGuard } from '../common/guards/tenant.guard';
import { CurrentTenant } from '../common/decorators/current-tenant.decorator';
import type { TenantContext } from '../common/decorators/current-tenant.decorator';
import { RiskService } from './risk.service';
import { AddBlocklistDto } from './dto/add-blocklist.dto';
import { GdprDeleteBlocklistDto } from './dto/gdpr-delete-blocklist.dto';

@Controller('risk')
@UseGuards(JwtAuthGuard, TenantGuard)
export class RiskController {
  constructor(private readonly risk: RiskService) {}

  @Get('blocklist')
  list(@CurrentTenant() t: TenantContext | undefined) {
    return this.risk.listBlocklist(t!.tenantId);
  }

  @Post('blocklist')
  add(
    @CurrentTenant() t: TenantContext | undefined,
    @Body() dto: AddBlocklistDto,
  ) {
    return this.risk.addBlocklist(t!.tenantId, dto.type, dto.value, dto.reason);
  }

  @Delete('blocklist/:id')
  remove(
    @CurrentTenant() t: TenantContext | undefined,
    @Param('id') id: string,
  ) {
    return this.risk.removeBlocklist(id, t!.tenantId);
  }

  /** GDPR/CCPA — remove a value from tenant-scoped blocklist (and Redis cache). */
  @Post('blocklist/gdpr-delete')
  gdprDelete(
    @CurrentTenant() t: TenantContext | undefined,
    @Body() dto: GdprDeleteBlocklistDto,
  ) {
    return this.risk.deleteByValue(t!.tenantId, dto.type, dto.value);
  }
}
