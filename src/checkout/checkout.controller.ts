import { Body, Controller, Get, Ip, Param, Post } from '@nestjs/common';
import { InvoicesService } from '../invoices/invoices.service';
import { TransactionsService } from '../transactions/transactions.service';

class CompleteCheckoutDto {
  email?: string;
  deviceFingerprint?: string;
}

@Controller('checkout')
export class CheckoutController {
  constructor(
    private readonly invoices: InvoicesService,
    private readonly txns: TransactionsService,
  ) {}

  @Get(':hostedPath')
  getOne(@Param('hostedPath') hostedPath: string) {
    return this.invoices.getPublicCheckout(hostedPath);
  }

  @Post(':hostedPath/complete')
  complete(
    @Param('hostedPath') hostedPath: string,
    @Body() body: CompleteCheckoutDto,
    @Ip() ip: string,
  ) {
    return this.txns.processHostedCheckout(hostedPath, body, ip);
  }
}
