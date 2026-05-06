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
import { ApiKeysService } from './api-keys.service';
import { IsOptional, IsString } from 'class-validator';

class CreateApiKeyDto {
  @IsOptional()
  @IsString()
  name?: string;
}

@Controller('tenants/api-keys')
@UseGuards(JwtAuthGuard, TenantGuard)
export class ApiKeysController {
  constructor(private readonly svc: ApiKeysService) {}

  @Get()
  list(@CurrentTenant() t: TenantContext | undefined) {
    return this.svc.list(t!.tenantId);
  }

  @Post()
  create(
    @CurrentTenant() t: TenantContext | undefined,
    @Body() dto: CreateApiKeyDto,
  ) {
    return this.svc.create(t!.tenantId, dto.name);
  }

  @Delete(':id')
  revoke(
    @CurrentTenant() t: TenantContext | undefined,
    @Param('id') id: string,
  ) {
    return this.svc.revoke(t!.tenantId, id);
  }
}
