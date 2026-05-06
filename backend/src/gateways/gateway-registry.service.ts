import { Injectable } from '@nestjs/common';
import type { GatewayAdapter } from './interfaces/gateway-adapter.interface';
import { MockGatewayAdapter } from './adapters/mock.adapter';
import { StripeGatewayAdapter } from './adapters/stripe.adapter';
import { PaypalGatewayAdapter } from './adapters/paypal.adapter';
import { CoinbaseGatewayAdapter } from './adapters/coinbase.adapter';
import { CashappGatewayAdapter } from './adapters/cashapp.adapter';

@Injectable()
export class GatewayRegistryService {
  private readonly adapters: Map<string, GatewayAdapter>;

  constructor(
    mock: MockGatewayAdapter,
    stripe: StripeGatewayAdapter,
    paypal: PaypalGatewayAdapter,
    coinbase: CoinbaseGatewayAdapter,
    cashapp: CashappGatewayAdapter,
  ) {
    this.adapters = new Map<string, GatewayAdapter>([
      [mock.code, mock],
      [stripe.code, stripe],
      [paypal.code, paypal],
      [coinbase.code, coinbase],
      [cashapp.code, cashapp],
    ]);
  }

  get(code: string): GatewayAdapter | undefined {
    return this.adapters.get(code);
  }

  list(): GatewayAdapter[] {
    return [...this.adapters.values()];
  }
}
