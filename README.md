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

## Railway (monorepo)

Railway discovers **`railway.json` at the repository root** automatically. That file in this repo defines the **API (Nest + Prisma)** build and start commands. Config-as-code **does not follow** the service **Root Directory** setting; nested paths must be set explicitly if you do not use the root file.

For **two services** from this repo (API + web), use a **shared workspace build from the repo root**:

1. Create two Railway services connected to the same GitHub repo.
2. For **both** services, set **Root Directory** to **`/`** (repository root), so `npm ci` can install workspaces.
3. **API service — Config-as-code path**
   - Leave **empty** (recommended): Railway reads **`/railway.json`** at the repo root and gets the workspace-aware Nest build/start commands.
   - Or set explicitly to **`/backend/railway.json`** (same contents as root; useful if you prefer the config next to `backend/`).
4. **Frontend service — Config-as-code path** (**required**): set **`/frontend/railway.json`**. If you leave this empty, Railway will load the **root** `railway.json` (API) and the web service will try to start the wrong app.
5. Redeploy.

Alternatively, omit config-as-code and set **Build** / **Start** / **Pre-deploy** in the dashboard to the root scripts: `railway:backend:build`, `railway:backend:migrate` (pre-deploy), `railway:backend:start`, and `railway:frontend:build` / `railway:frontend:start`.

Set **`NEXT_PUBLIC_API_URL`** on the frontend service to `https://<your-api-host>/api`, and **`FRONTEND_URL`** on the API to your frontend’s public URL.

If you prefer **Root Directory = `/backend`** (isolated) on the API service, skip the workspace-based config file and use dashboard commands instead (`npm ci`, `npx prisma generate`, `npm run build`, `npm run start:prod`, pre-deploy `npx prisma migrate deploy`), all run from that folder.

## Compliance

See [docs/COMPLIANCE.md](docs/COMPLIANCE.md) before going live.

## PDF export

- [export_polapine_plan_pdf.py](export_polapine_plan_pdf.py) — plan → PDF
