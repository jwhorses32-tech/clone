import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as argon2 from 'argon2';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL required for seed');
}

const pool = new Pool({ connectionString });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

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
