import type { GatewayAdapter } from './interfaces/gateway-adapter.interface';
import { MockGatewayAdapter } from './adapters/mock.adapter';
import { StripeGatewayAdapter } from './adapters/stripe.adapter';
import { PaypalGatewayAdapter } from './adapters/paypal.adapter';
import { CoinbaseGatewayAdapter } from './adapters/coinbase.adapter';
import { CashappGatewayAdapter } from './adapters/cashapp.adapter';
export declare class GatewayRegistryService {
    private readonly adapters;
    constructor(mock: MockGatewayAdapter, stripe: StripeGatewayAdapter, paypal: PaypalGatewayAdapter, coinbase: CoinbaseGatewayAdapter, cashapp: CashappGatewayAdapter);
    get(code: string): GatewayAdapter | undefined;
    list(): GatewayAdapter[];
}
