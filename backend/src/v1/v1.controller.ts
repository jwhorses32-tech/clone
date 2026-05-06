import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import {
  ApiKeyGuard,
  type ApiKeyRequest,
} from '../common/guards/api-key.guard';
import { InvoicesService } from '../invoices/invoices.service';
import { CreateInvoiceV1Dto } from './dto/create-invoice-v1.dto';

@Controller('v1')
@UseGuards(ApiKeyGuard)
export class V1Controller {
  constructor(private readonly invoices: InvoicesService) {}

  @Get('health')
  health() {
    return { ok: true, version: '4.1', service: 'polapine-clone-api' };
  }

  @Post('create-invoice')
  createInvoice(@Req() req: Request, @Body() dto: CreateInvoiceV1Dto) {
    const tenantId = (req as ApiKeyRequest).tenant!.tenantId;
    return this.invoices.createFromApi(tenantId, {
      amount: dto.amount,
      brand_slug: dto.brand_slug,
      order_reference: dto.order_reference,
      webhook_url: dto.webhook_url,
      idempotency_key: dto.idempotency_key,
    });
  }
}
