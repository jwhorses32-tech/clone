"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockGatewayAdapter = void 0;
const common_1 = require("@nestjs/common");
let MockGatewayAdapter = class MockGatewayAdapter {
    code = 'mock';
    async authorize(ctx) {
        const start = Date.now();
        const failRate = Number(ctx.credentials['failRate'] ?? 0);
        const latencyMs = Number(ctx.credentials['latencyMs'] ?? 20);
        if (latencyMs > 0)
            await new Promise((r) => setTimeout(r, Math.min(latencyMs, 2000)));
        const roll = Math.random();
        if (roll < failRate) {
            return {
                success: false,
                errorCode: 'mock_declined',
                latencyMs: Date.now() - start,
            };
        }
        return {
            success: true,
            gatewayRef: `mock_${Date.now()}`,
            latencyMs: Date.now() - start,
            raw: { mock: true },
        };
    }
    capture(ctx) {
        return Promise.resolve({
            success: true,
            gatewayRef: ctx.gatewayRef,
            raw: { captured: true },
        });
    }
    refund(ctx) {
        return Promise.resolve({
            success: true,
            gatewayRef: ctx.gatewayRef,
            raw: { refunded: ctx.amountCents },
        });
    }
    void(ctx) {
        return Promise.resolve({ success: true, gatewayRef: ctx.gatewayRef });
    }
    verifyWebhook() {
        return true;
    }
    getHealth() {
        return Promise.resolve({ ok: true });
    }
};
exports.MockGatewayAdapter = MockGatewayAdapter;
exports.MockGatewayAdapter = MockGatewayAdapter = __decorate([
    (0, common_1.Injectable)()
], MockGatewayAdapter);
//# sourceMappingURL=mock.adapter.js.map