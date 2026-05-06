import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { JwtPayload } from '../auth/jwt-payload';
import { TenantsService } from './tenants.service';
import { CreateTenantDto } from './dto/create-tenant.dto';

@Controller('tenants')
export class TenantsController {
  constructor(private readonly tenants: TenantsService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  list(@CurrentUser() user: JwtPayload | undefined) {
    return this.tenants.listForUser(user!.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @CurrentUser() user: JwtPayload | undefined,
    @Body() dto: CreateTenantDto,
  ) {
    return this.tenants.create(user!.sub, dto.brandSlug, dto.displayName);
  }
}
