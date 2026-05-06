"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GatewayRegistryService = void 0;
const common_1 = require("@nestjs/common");
const mock_adapter_1 = require("./adapters/mock.adapter");
const stripe_adapter_1 = require("./adapters/stripe.adapter");
const paypal_adapter_1 = require("./adapters/paypal.adapter");
const coinbase_adapter_1 = require("./adapters/coinbase.adapter");
const cashapp_adapter_1 = require("./adapters/cashapp.adapter");
let GatewayRegistryService = class GatewayRegistryService {
    adapters;
    constructor(mock, stripe, paypal, coinbase, cashapp) {
        this.adapters = new Map([
            [mock.code, mock],
            [stripe.code, stripe],
            [paypal.code, paypal],
            [coinbase.code, coinbase],
            [cashapp.code, cashapp],
        ]);
    }
    get(code) {
        return this.adapters.get(code);
    }
    list() {
        return [...this.adapters.values()];
    }
};
exports.GatewayRegistryService = GatewayRegistryService;
exports.GatewayRegistryService = GatewayRegistryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [mock_adapter_1.MockGatewayAdapter,
        stripe_adapter_1.StripeGatewayAdapter,
        paypal_adapter_1.PaypalGatewayAdapter,
        coinbase_adapter_1.CoinbaseGatewayAdapter,
        cashapp_adapter_1.CashappGatewayAdapter])
], GatewayRegistryService);
//# sourceMappingURL=gateway-registry.service.js.map