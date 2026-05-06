# Compliance & legal checklist (Polapine Clone)

This document satisfies the **compliance-track** milestone: items to resolve **before** processing real cardholder data or moving money.

## PCI DSS

- **Target SAQ-A**: keep card data off your servers. Use Stripe Elements, Stripe Checkout, or other hosted fields so card PAN never touches this codebase.
- Document your SAQ type with your acquirer / processor after integration.

## GDPR / CCPA — Risk Manager & blocklists

- Permanent “disputer databases” require a **lawful basis**, **data minimization**, and **erasure** workflows.
- This implementation includes `POST /api/risk/blocklist/gdpr-delete` (tenant-scoped) to remove entries and Redis cache keys.
- Define retention periods and purge jobs for `BlocklistEntry` rows.

## Money transmission & settlement

- **BYOK + direct settlement** to the merchant’s processor account reduces MTL exposure versus aggregating funds on your ledger.
- If you settle funds through your own bank accounts, engage counsel for U.S. MTL / FinCEN registration requirements.

## BYOK secret custody

- Gateway secrets are **envelope-encrypted at rest** (`EncryptionService`) — replace the local key with **KMS-wrapped DEKs** in production.
- Audit every read/decrypt of merchant credentials; never log secrets.

## High-risk merchants

- Publish an **acceptable use policy** before onboarding unknown merchants.
- Underwriting / KYC: `kycApprovedAt` on `Tenant` is a stub — connect to your KYC vendor.

## References

- Stripe: PCI integration guidelines  
- GDPR: Art. 5 (principles), Art. 17 (erasure)  
- FinCEN: money services business guidance  
