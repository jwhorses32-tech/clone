import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { randomBytes } from 'crypto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { TenantGuard } from '../common/guards/tenant.guard';
import { CurrentTenant } from '../common/decorators/current-tenant.decorator';
import type { TenantContext } from '../common/decorators/current-tenant.decorator';
import { PrismaService } from '../prisma/prisma.service';
import { CreateWebhookEndpointDto } from './dto/create-webhook-endpoint.dto';

@Controller('tenants/webhook-endpoints')
@UseGuards(JwtAuthGuard, TenantGuard)
export class WebhookEndpointsController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  list(@CurrentTenant() t: TenantContext | undefined) {
    return this.prisma.webhookEndpoint.findMany({
      where: { tenantId: t!.tenantId },
      select: {
        id: true,
        url: true,
        events: true,
        isActive: true,
        createdAt: true,
      },
    });
  }

  @Post()
  async create(
    @CurrentTenant() t: TenantContext | undefined,
    @Body() dto: CreateWebhookEndpointDto,
  ) {
    const secret = randomBytes(32).toString('hex');
    return this.prisma.webhookEndpoint.create({
      data: {
        tenantId: t!.tenantId,
        url: dto.url,
        secret,
        events: dto.events?.length ? dto.events : ['*'],
      },
      select: {
        id: true,
        url: true,
        events: true,
        secret: true,
        createdAt: true,
      },
    });
  }
}
