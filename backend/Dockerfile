# ── Build stage ──────────────────────────────────────────────────────────────
FROM node:22-alpine AS builder

WORKDIR /app

# Install dependencies
# Build context is the repo root, so all paths are relative to the monorepo root.
# Copy root workspace package.json and lock file, then backend/package.json.
COPY package*.json ./
COPY backend/package.json ./backend/
RUN npm ci

# Copy source files
COPY backend/src ./backend/src
COPY backend/prisma ./backend/prisma
COPY backend/nest-cli.json backend/tsconfig.json backend/tsconfig.build.json ./backend/

# Generate Prisma client and compile TypeScript
RUN npm run prisma:generate --workspace backend
RUN npm run build --workspace backend

# ── Runtime stage ─────────────────────────────────────────────────────────────
FROM node:22-alpine AS runtime

WORKDIR /app

# Install production dependencies only
# Build context is the repo root, so all paths are relative to the monorepo root.
COPY package*.json ./
COPY backend/package.json ./backend/
RUN npm ci --omit=dev

# Copy Prisma schema and generated client
COPY backend/prisma ./backend/prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# Copy compiled application
COPY --from=builder /app/backend/dist ./backend/dist

EXPOSE 3001

CMD ["node", "backend/dist/main"]
