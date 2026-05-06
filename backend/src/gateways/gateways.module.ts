import { Module } from '@nestjs/common';
import { MockGatewayAdapter } from './adapters/mock.adapter';
import { StripeGatewayAdapter } from './adapters/stripe.adapter';
import { PaypalGatewayAdapter } from './adapters/paypal.adapter';
import { CoinbaseGatewayAdapter } from './adapters/coinbase.adapter';
import { CashappGatewayAdapter } from './adapters/cashapp.adapter';
import { GatewayRegistryService } from './gateway-registry.service';
import { MerchantGatewaysController } from './merchant-gateways.controller';
import { MerchantGatewaysService } from './merchant-gateways.service';

@Module({
  controllers: [MerchantGatewaysController],
  providers: [
    MockGatewayAdapter,
    StripeGatewayAdapter,
    PaypalGatewayAdapter,
    CoinbaseGatewayAdapter,
    CashappGatewayAdapter,
    GatewayRegistryService,
    MerchantGatewaysService,
  ],
  exports: [GatewayRegistryService, MerchantGatewaysService],
})
export class GatewaysModule {}
