"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GatewaysModule = void 0;
const common_1 = require("@nestjs/common");
const mock_adapter_1 = require("./adapters/mock.adapter");
const stripe_adapter_1 = require("./adapters/stripe.adapter");
const paypal_adapter_1 = require("./adapters/paypal.adapter");
const coinbase_adapter_1 = require("./adapters/coinbase.adapter");
const cashapp_adapter_1 = require("./adapters/cashapp.adapter");
const gateway_registry_service_1 = require("./gateway-registry.service");
const merchant_gateways_controller_1 = require("./merchant-gateways.controller");
const merchant_gateways_service_1 = require("./merchant-gateways.service");
let GatewaysModule = class GatewaysModule {
};
exports.GatewaysModule = GatewaysModule;
exports.GatewaysModule = GatewaysModule = __decorate([
    (0, common_1.Module)({
        controllers: [merchant_gateways_controller_1.MerchantGatewaysController],
        providers: [
            mock_adapter_1.MockGatewayAdapter,
            stripe_adapter_1.StripeGatewayAdapter,
            paypal_adapter_1.PaypalGatewayAdapter,
            coinbase_adapter_1.CoinbaseGatewayAdapter,
            cashapp_adapter_1.CashappGatewayAdapter,
            gateway_registry_service_1.GatewayRegistryService,
            merchant_gateways_service_1.MerchantGatewaysService,
        ],
        exports: [gateway_registry_service_1.GatewayRegistryService, merchant_gateways_service_1.MerchantGatewaysService],
    })
], GatewaysModule);
//# sourceMappingURL=gateways.module.js.map