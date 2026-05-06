-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "PaymentOrderStatus" AS ENUM ('PENDING', 'REQUIRES_ACTION', 'SUCCEEDED', 'FAILED', 'CANCELED');

-- CreateEnum
CREATE TYPE "LedgerEntryType" AS ENUM ('CREDIT', 'DEBIT');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'STAFF', 'ADMIN');

-- CreateEnum
CREATE TYPE "TenantStatus" AS ENUM ('PENDING', 'ACTIVE', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "MembershipRole" AS ENUM ('OWNER', 'ADMIN', 'DEV', 'VIEWER');

-- CreateEnum
CREATE TYPE "MerchantPaymentStatus" AS ENUM ('CREATED', 'ROUTING', 'AUTHORIZED', 'CAPTURED', 'SETTLED', 'FAILED', 'REFUNDED', 'DISPUTED', 'CANCELED');

-- CreateEnum
CREATE TYPE "AttemptStatus" AS ENUM ('PENDING', 'SUCCEEDED', 'FAILED', 'SKIPPED');

-- CreateEnum
CREATE TYPE "InvoiceStatus" AS ENUM ('DRAFT', 'OPEN', 'PAID', 'VOID', 'EXPIRED');

-- CreateEnum
CREATE TYPE "PaymentLinkStatus" AS ENUM ('ACTIVE', 'USED', 'EXPIRED', 'DISABLED');

-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('TRIALING', 'ACTIVE', 'PAST_DUE', 'CANCELED');

-- CreateEnum
CREATE TYPE "BlocklistType" AS ENUM ('EMAIL', 'CARD_FINGERPRINT', 'DEVICE', 'IP');

-- CreateEnum
CREATE TYPE "RiskRuleAction" AS ENUM ('ALLOW', 'BLOCK', 'REVIEW');

-- CreateEnum
CREATE TYPE "WebhookDeliveryStatus" AS ENUM ('PENDING', 'SUCCESS', 'FAILED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "displayName" TEXT,
    "passwordHash" TEXT,
    "pinHash" TEXT,
    "emailVerifiedAt" TIMESTAMP(3),
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "emailVerificationToken" TEXT,
    "passwordResetToken" TEXT,
    "passwordResetExpires" TIMESTAMP(3),
    "pinResetToken" TEXT,
    "pinResetExpires" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Wallet" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "balance" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Wallet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LedgerEntry" (
    "id" TEXT NOT NULL,
    "walletId" TEXT NOT NULL,
    "orderId" TEXT,
    "type" "LedgerEntryType" NOT NULL,
    "amount" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "description" TEXT NOT NULL,
    "idempotencyKey" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LedgerEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaymentOrder" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "creditAmount" INTEGER NOT NULL,
    "provider" TEXT NOT NULL,
    "providerOrderId" TEXT,
    "status" "PaymentOrderStatus" NOT NULL DEFAULT 'PENDING',
    "idempotencyKey" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PaymentOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaymentEvent" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "providerEventId" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PaymentEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tenant" (
    "id" TEXT NOT NULL,
    "brandSlug" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "status" "TenantStatus" NOT NULL DEFAULT 'PENDING',
    "planId" TEXT,
    "depositCents" INTEGER NOT NULL DEFAULT 0,
    "monthlyVolumeCents" INTEGER NOT NULL DEFAULT 0,
    "kycApprovedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tenant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Membership" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "role" "MembershipRole" NOT NULL DEFAULT 'DEV',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Membership_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApiKey" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "publicKey" TEXT NOT NULL,
    "secretHash" TEXT NOT NULL,
    "name" TEXT,
    "scopes" TEXT[] DEFAULT ARRAY['read', 'write']::TEXT[],
    "lastUsedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "revokedAt" TIMESTAMP(3),

    CONSTRAINT "ApiKey_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Gateway" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "capabilities" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Gateway_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MerchantGateway" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "gatewayId" TEXT NOT NULL,
    "encryptedCreds" TEXT NOT NULL DEFAULT '{}',
    "status" TEXT NOT NULL DEFAULT 'active',
    "weight" INTEGER NOT NULL DEFAULT 100,
    "successRate" DOUBLE PRECISION NOT NULL DEFAULT 0.85,
    "costFactor" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MerchantGateway_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Plan" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "monthlyVolumeMinCents" INTEGER NOT NULL DEFAULT 0,
    "monthlyVolumeMaxCents" INTEGER,
    "depositCents" INTEGER NOT NULL DEFAULT 0,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Plan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subscription" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "status" "SubscriptionStatus" NOT NULL DEFAULT 'ACTIVE',
    "depositPaidAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SecurityDeposit" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "amountCents" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "stripePaymentIntentId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "refundedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SecurityDeposit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Invoice" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "orderReference" TEXT NOT NULL,
    "amountCents" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "status" "InvoiceStatus" NOT NULL DEFAULT 'OPEN',
    "webhookUrl" TEXT,
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Invoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaymentLink" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "invoiceId" TEXT,
    "amountCents" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "status" "PaymentLinkStatus" NOT NULL DEFAULT 'ACTIVE',
    "hostedPath" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PaymentLink_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaymentTransaction" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "invoiceId" TEXT,
    "amountCents" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "status" "MerchantPaymentStatus" NOT NULL DEFAULT 'CREATED',
    "customerFingerprint" TEXT,
    "riskScore" DOUBLE PRECISION,
    "idempotencyKey" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PaymentTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaymentTransactionAttempt" (
    "id" TEXT NOT NULL,
    "transactionId" TEXT NOT NULL,
    "gatewayId" TEXT NOT NULL,
    "status" "AttemptStatus" NOT NULL DEFAULT 'PENDING',
    "gatewayRef" TEXT,
    "latencyMs" INTEGER,
    "errorCode" TEXT,
    "rawResponse" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PaymentTransactionAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WebhookEndpoint" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "secret" TEXT NOT NULL,
    "events" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WebhookEndpoint_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WebhookDelivery" (
    "id" TEXT NOT NULL,
    "endpointId" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "nextAttemptAt" TIMESTAMP(3),
    "lastStatus" "WebhookDeliveryStatus" NOT NULL DEFAULT 'PENDING',
    "lastError" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WebhookDelivery_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlocklistEntry" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT,
    "type" "BlocklistType" NOT NULL,
    "value" TEXT NOT NULL,
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3),

    CONSTRAINT "BlocklistEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RiskRule" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "expression" TEXT NOT NULL,
    "action" "RiskRuleAction" NOT NULL DEFAULT 'BLOCK',
    "priority" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RiskRule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "actorId" TEXT,
    "tenantId" TEXT,
    "action" TEXT NOT NULL,
    "target" TEXT,
    "metadata" JSONB,
    "ip" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_emailVerificationToken_key" ON "User"("emailVerificationToken");

-- CreateIndex
CREATE UNIQUE INDEX "User_passwordResetToken_key" ON "User"("passwordResetToken");

-- CreateIndex
CREATE UNIQUE INDEX "User_pinResetToken_key" ON "User"("pinResetToken");

-- CreateIndex
CREATE UNIQUE INDEX "Wallet_userId_key" ON "Wallet"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "LedgerEntry_idempotencyKey_key" ON "LedgerEntry"("idempotencyKey");

-- CreateIndex
CREATE INDEX "LedgerEntry_walletId_createdAt_idx" ON "LedgerEntry"("walletId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "PaymentOrder_providerOrderId_key" ON "PaymentOrder"("providerOrderId");

-- CreateIndex
CREATE UNIQUE INDEX "PaymentOrder_idempotencyKey_key" ON "PaymentOrder"("idempotencyKey");

-- CreateIndex
CREATE UNIQUE INDEX "PaymentEvent_providerEventId_key" ON "PaymentEvent"("providerEventId");

-- CreateIndex
CREATE INDEX "PaymentEvent_orderId_createdAt_idx" ON "PaymentEvent"("orderId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Tenant_brandSlug_key" ON "Tenant"("brandSlug");

-- CreateIndex
CREATE INDEX "Membership_tenantId_idx" ON "Membership"("tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "Membership_userId_tenantId_key" ON "Membership"("userId", "tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "ApiKey_publicKey_key" ON "ApiKey"("publicKey");

-- CreateIndex
CREATE INDEX "ApiKey_tenantId_idx" ON "ApiKey"("tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "Gateway_code_key" ON "Gateway"("code");

-- CreateIndex
CREATE INDEX "MerchantGateway_tenantId_idx" ON "MerchantGateway"("tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "MerchantGateway_tenantId_gatewayId_key" ON "MerchantGateway"("tenantId", "gatewayId");

-- CreateIndex
CREATE UNIQUE INDEX "Plan_slug_key" ON "Plan"("slug");

-- CreateIndex
CREATE INDEX "Subscription_tenantId_idx" ON "Subscription"("tenantId");

-- CreateIndex
CREATE INDEX "SecurityDeposit_tenantId_idx" ON "SecurityDeposit"("tenantId");

-- CreateIndex
CREATE INDEX "Invoice_tenantId_createdAt_idx" ON "Invoice"("tenantId", "createdAt");

-- CreateIndex
CREATE INDEX "Invoice_orderReference_tenantId_idx" ON "Invoice"("orderReference", "tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "PaymentLink_hostedPath_key" ON "PaymentLink"("hostedPath");

-- CreateIndex
CREATE INDEX "PaymentLink_tenantId_idx" ON "PaymentLink"("tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "PaymentTransaction_idempotencyKey_key" ON "PaymentTransaction"("idempotencyKey");

-- CreateIndex
CREATE INDEX "PaymentTransaction_tenantId_status_createdAt_idx" ON "PaymentTransaction"("tenantId", "status", "createdAt");

-- CreateIndex
CREATE INDEX "PaymentTransactionAttempt_transactionId_idx" ON "PaymentTransactionAttempt"("transactionId");

-- CreateIndex
CREATE INDEX "WebhookEndpoint_tenantId_idx" ON "WebhookEndpoint"("tenantId");

-- CreateIndex
CREATE INDEX "WebhookDelivery_lastStatus_nextAttemptAt_idx" ON "WebhookDelivery"("lastStatus", "nextAttemptAt");

-- CreateIndex
CREATE INDEX "BlocklistEntry_tenantId_type_value_idx" ON "BlocklistEntry"("tenantId", "type", "value");

-- CreateIndex
CREATE INDEX "BlocklistEntry_type_value_idx" ON "BlocklistEntry"("type", "value");

-- CreateIndex
CREATE INDEX "RiskRule_tenantId_priority_idx" ON "RiskRule"("tenantId", "priority");

-- CreateIndex
CREATE INDEX "AuditLog_tenantId_createdAt_idx" ON "AuditLog"("tenantId", "createdAt");

-- CreateIndex
CREATE INDEX "AuditLog_actorId_createdAt_idx" ON "AuditLog"("actorId", "createdAt");

-- AddForeignKey
ALTER TABLE "Wallet" ADD CONSTRAINT "Wallet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LedgerEntry" ADD CONSTRAINT "LedgerEntry_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "Wallet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LedgerEntry" ADD CONSTRAINT "LedgerEntry_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "PaymentOrder"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentOrder" ADD CONSTRAINT "PaymentOrder_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentEvent" ADD CONSTRAINT "PaymentEvent_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "PaymentOrder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tenant" ADD CONSTRAINT "Tenant_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plan"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Membership" ADD CONSTRAINT "Membership_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Membership" ADD CONSTRAINT "Membership_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApiKey" ADD CONSTRAINT "ApiKey_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MerchantGateway" ADD CONSTRAINT "MerchantGateway_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MerchantGateway" ADD CONSTRAINT "MerchantGateway_gatewayId_fkey" FOREIGN KEY ("gatewayId") REFERENCES "Gateway"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SecurityDeposit" ADD CONSTRAINT "SecurityDeposit_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentLink" ADD CONSTRAINT "PaymentLink_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentLink" ADD CONSTRAINT "PaymentLink_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentTransaction" ADD CONSTRAINT "PaymentTransaction_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentTransaction" ADD CONSTRAINT "PaymentTransaction_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentTransactionAttempt" ADD CONSTRAINT "PaymentTransactionAttempt_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "PaymentTransaction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentTransactionAttempt" ADD CONSTRAINT "PaymentTransactionAttempt_gatewayId_fkey" FOREIGN KEY ("gatewayId") REFERENCES "Gateway"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WebhookEndpoint" ADD CONSTRAINT "WebhookEndpoint_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WebhookDelivery" ADD CONSTRAINT "WebhookDelivery_endpointId_fkey" FOREIGN KEY ("endpointId") REFERENCES "WebhookEndpoint"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlocklistEntry" ADD CONSTRAINT "BlocklistEntry_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RiskRule" ADD CONSTRAINT "RiskRule_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE SET NULL ON UPDATE CASCADE;
