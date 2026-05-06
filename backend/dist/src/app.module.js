"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const config_1 = require("@nestjs/config");
const throttler_1 = require("@nestjs/throttler");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const prisma_module_1 = require("./prisma/prisma.module");
const common_module_1 = require("./common/common.module");
const redis_module_1 = require("./redis/redis.module");
const notifications_module_1 = require("./notifications/notifications.module");
const auth_module_1 = require("./auth/auth.module");
const tenants_module_1 = require("./tenants/tenants.module");
const api_keys_module_1 = require("./api-keys/api-keys.module");
const gateways_module_1 = require("./gateways/gateways.module");
const orchestration_module_1 = require("./orchestration/orchestration.module");
const risk_module_1 = require("./risk/risk.module");
const webhooks_module_1 = require("./webhooks/webhooks.module");
const transactions_module_1 = require("./transactions/transactions.module");
const invoices_module_1 = require("./invoices/invoices.module");
const checkout_module_1 = require("./checkout/checkout.module");
const v1_module_1 = require("./v1/v1.module");
const webhook_endpoints_module_1 = require("./webhook-endpoints/webhook-endpoints.module");
const analytics_module_1 = require("./analytics/analytics.module");
const billing_module_1 = require("./billing/billing.module");
const admin_module_1 = require("./admin/admin.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: ['.env.local', '.env'],
            }),
            throttler_1.ThrottlerModule.forRoot({
                throttlers: [{ ttl: 60_000, limit: 300 }],
            }),
            prisma_module_1.PrismaModule,
            common_module_1.CommonModule,
            redis_module_1.RedisModule,
            notifications_module_1.NotificationsModule,
            auth_module_1.AuthModule,
            tenants_module_1.TenantsModule,
            api_keys_module_1.ApiKeysModule,
            gateways_module_1.GatewaysModule,
            orchestration_module_1.OrchestrationModule,
            risk_module_1.RiskModule,
            webhooks_module_1.WebhooksModule,
            transactions_module_1.TransactionsModule,
            invoices_module_1.InvoicesModule,
            checkout_module_1.CheckoutModule,
            v1_module_1.V1Module,
            webhook_endpoints_module_1.WebhookEndpointsModule,
            analytics_module_1.AnalyticsModule,
            billing_module_1.BillingModule,
            admin_module_1.AdminModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [
            app_service_1.AppService,
            {
                provide: core_1.APP_GUARD,
                useClass: throttler_1.ThrottlerGuard,
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map