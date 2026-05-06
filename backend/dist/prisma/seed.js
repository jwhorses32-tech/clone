"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const client_1 = require("@prisma/client");
const adapter_pg_1 = require("@prisma/adapter-pg");
const pg_1 = require("pg");
const argon2 = __importStar(require("argon2"));
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
    throw new Error('DATABASE_URL required for seed');
}
const pool = new pg_1.Pool({ connectionString });
const prisma = new client_1.PrismaClient({ adapter: new adapter_pg_1.PrismaPg(pool) });
async function main() {
    await prisma.gateway.createMany({
        data: [
            { code: 'mock', displayName: 'Mock Gateway', capabilities: ['card', 'apple_pay', 'google_pay'] },
            { code: 'stripe', displayName: 'Stripe', capabilities: ['card', 'apple_pay', 'google_pay'] },
            { code: 'paypal', displayName: 'PayPal', capabilities: ['card', 'wallet'] },
            { code: 'coinbase', displayName: 'Coinbase Commerce', capabilities: ['crypto'] },
            { code: 'cashapp', displayName: 'Cash App Pay', capabilities: ['wallet'] },
        ],
        skipDuplicates: true,
    });
    await prisma.plan.createMany({
        data: [
            { slug: 'cc', name: 'CC', monthlyVolumeMinCents: 50_000, monthlyVolumeMaxCents: 100_000, depositCents: 0, sortOrder: 0 },
            { slug: 'silver', name: 'Silver', monthlyVolumeMinCents: 500_000, monthlyVolumeMaxCents: 2_000_000, depositCents: 50_000, sortOrder: 1 },
            { slug: 'platinum', name: 'Platinum', monthlyVolumeMinCents: 2_000_000, monthlyVolumeMaxCents: 5_000_000, depositCents: 200_000, sortOrder: 2 },
            { slug: 'gold', name: 'Gold', monthlyVolumeMinCents: 5_000_000, monthlyVolumeMaxCents: 10_000_000, depositCents: 500_000, sortOrder: 3 },
            { slug: 'diamond', name: 'Diamond', monthlyVolumeMinCents: 10_000_000, monthlyVolumeMaxCents: 20_000_000, depositCents: 2_000_000, sortOrder: 4 },
            { slug: 'enterprise', name: 'Enterprise', monthlyVolumeMinCents: 20_000_000, monthlyVolumeMaxCents: null, depositCents: 10_000_000, sortOrder: 5 },
        ],
        skipDuplicates: true,
    });
    const adminEmail = process.env.SEED_ADMIN_EMAIL ?? 'admin@localhost.test';
    const adminPass = process.env.SEED_ADMIN_PASSWORD ?? 'adminadminadmin';
    const existing = await prisma.user.findUnique({ where: { email: adminEmail } });
    if (!existing) {
        await prisma.user.create({
            data: {
                email: adminEmail,
                displayName: 'Platform Admin',
                passwordHash: await argon2.hash(adminPass),
                pinHash: await argon2.hash('1234'),
                emailVerifiedAt: new Date(),
                role: 'ADMIN',
            },
        });
        console.log(`Seeded admin user: ${adminEmail} / ${adminPass}`);
    }
    console.log('Seed complete.');
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
});
//# sourceMappingURL=seed.js.map