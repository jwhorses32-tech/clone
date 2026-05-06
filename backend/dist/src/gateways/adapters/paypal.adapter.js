"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaypalGatewayAdapter = void 0;
const common_1 = require("@nestjs/common");
let PaypalGatewayAdapter = class PaypalGatewayAdapter {
    code = 'paypal';
    authorize(ctx) {
        return Promise.resolve({
            success: true,
            gatewayRef: `paypal_stub_${ctx.amountCents}_${Date.now()}`,
            raw: { stub: true },
        });
    }
    capture(ctx) {
        return Promise.resolve({ success: true, gatewayRef: ctx.gatewayRef });
    }
    refund(ctx) {
        return Promise.resolve({
            success: true,
            gatewayRef: ctx.gatewayRef,
            raw: { amount: ctx.amountCents },
        });
    }
    void(ctx) {
        return Promise.resolve({ success: true, gatewayRef: ctx.gatewayRef });
    }
    verifyWebhook() {
        return true;
    }
    getHealth() {
        return Promise.resolve({ ok: true, message: 'paypal_stub' });
    }
};
exports.PaypalGatewayAdapter = PaypalGatewayAdapter;
exports.PaypalGatewayAdapter = PaypalGatewayAdapter = __decorate([
    (0, common_1.Injectable)()
], PaypalGatewayAdapter);
//# sourceMappingURL=paypal.adapter.js.map