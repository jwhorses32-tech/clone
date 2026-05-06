# GR — Polapine-style payment orchestration (monorepo)

NestJS **backend** (`backend/`) + Next.js **frontend** (`frontend/`) implementing a multi-tenant payment orchestration SaaS: marketing site, auth, merchant dashboard, **REST API v4.1** (`POST /api/v1/create-invoice`), hosted checkout (`/pay/[linkId]`), gateway adapters (mock, Stripe, PayPal stub, Coinbase stub, Cash App stub), routing + failover, risk blocklists, billing tiers, admin APIs, and MailHog email.

## Quick start

1. **Infrastructure**

   ```bash
   docker compose up -d
   ```

2. **Database**

   ```bash
   cd backend
   cp .env.example .env
   npx prisma migrate deploy
   npx prisma db seed
   ```

   Seed creates gateways, pricing plans, and an admin user (`SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` in `.env.example`).

3. **Backend** — `http://localhost:3001` · Swagger at `http://localhost:3001/api/docs`

   ```bash
   cd backend
   npm run start:dev
   ```

4. **Frontend** — `http://localhost:3000`

   ```bash
   cd frontend
   cp .env.example .env.local
   npm run dev
   ```

5. **Flow**

   - Register → verify email (open MailHog `http://localhost:8025`).
   - Create a **tenant** from the dashboard (after login, use API or add UI — `POST /api/tenants` with Bearer token).
   - Create **API keys** in the dashboard; call `POST /api/v1/create-invoice` with `X-API-Key` / `X-API-Secret` and `brand_slug` matching the tenant.
   - Open `payment_url` from the response and complete checkout (mock gateway).

## Compliance

See [docs/COMPLIANCE.md](docs/COMPLIANCE.md) before going live.

## PDF export

- [export_polapine_plan_pdf.py](export_polapine_plan_pdf.py) — plan → PDF
