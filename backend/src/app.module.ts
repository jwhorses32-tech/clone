import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { CommonModule } from './common/common.module';
import { RedisModule } from './redis/redis.module';
import { NotificationsModule } from './notifications/notifications.module';
import { AuthModule } from './auth/auth.module';
import { TenantsModule } from './tenants/tenants.module';
import { ApiKeysModule } from './api-keys/api-keys.module';
import { GatewaysModule } from './gateways/gateways.module';
import { OrchestrationModule } from './orchestration/orchestration.module';
import { RiskModule } from './risk/risk.module';
import { WebhooksModule } from './webhooks/webhooks.module';
import { TransactionsModule } from './transactions/transactions.module';
import { InvoicesModule } from './invoices/invoices.module';
import { CheckoutModule } from './checkout/checkout.module';
import { V1Module } from './v1/v1.module';
import { WebhookEndpointsModule } from './webhook-endpoints/webhook-endpoints.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { BillingModule } from './billing/billing.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    ThrottlerModule.forRoot({
      throttlers: [{ ttl: 60_000, limit: 300 }],
    }),
    PrismaModule,
    CommonModule,
    RedisModule,
    NotificationsModule,
    AuthModule,
    TenantsModule,
    ApiKeysModule,
    GatewaysModule,
    OrchestrationModule,
    RiskModule,
    WebhooksModule,
    TransactionsModule,
    InvoicesModule,
    CheckoutModule,
    V1Module,
    WebhookEndpointsModule,
    AnalyticsModule,
    BillingModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
