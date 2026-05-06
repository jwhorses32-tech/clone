"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CashappGatewayAdapter = void 0;
const common_1 = require("@nestjs/common");
let CashappGatewayAdapter = class CashappGatewayAdapter {
    code = 'cashapp';
    authorize(ctx) {
        return Promise.resolve({
            success: true,
            gatewayRef: `cashapp_stub_${ctx.amountCents}_${Date.now()}`,
            raw: { stub: true },
        });
    }
    capture(ctx) {
        return Promise.resolve({ success: true, gatewayRef: ctx.gatewayRef });
    }
    refund(ctx) {
        return Promise.resolve({ success: true, gatewayRef: ctx.gatewayRef });
    }
    void(ctx) {
        return Promise.resolve({ success: true, gatewayRef: ctx.gatewayRef });
    }
    verifyWebhook() {
        return true;
    }
    getHealth() {
        return Promise.resolve({ ok: true, message: 'cashapp_stub' });
    }
};
exports.CashappGatewayAdapter = CashappGatewayAdapter;
exports.CashappGatewayAdapter = CashappGatewayAdapter = __decorate([
    (0, common_1.Injectable)()
], CashappGatewayAdapter);
//# sourceMappingURL=cashapp.adapter.js.map