import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EncryptionService } from '../common/encryption.service';

@Injectable()
export class TenantsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly encryption: EncryptionService,
  ) {}

  async listForUser(userId: string) {
    return this.prisma.tenant.findMany({
      where: { memberships: { some: { userId } } },
      include: { plan: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(userId: string, brandSlug: string, displayName: string) {
    const slug = brandSlug
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    if (slug.length < 2) throw new ConflictException('brand_slug too short');

    const exists = await this.prisma.tenant.findUnique({
      where: { brandSlug: slug },
    });
    if (exists) throw new ConflictException('brand_slug taken');

    const tenant = await this.prisma.tenant.create({
      data: {
        brandSlug: slug,
        displayName,
        status: 'ACTIVE',
        memberships: { create: { userId, role: 'OWNER' } },
      },
    });

    const mockGateway = await this.prisma.gateway.findUnique({
      where: { code: 'mock' },
    });
    if (mockGateway) {
      const creds = this.encryption.encryptJson({ failRate: 0, latencyMs: 15 });
      await this.prisma.merchantGateway.create({
        data: {
          tenantId: tenant.id,
          gatewayId: mockGateway.id,
          encryptedCreds: creds,
          status: 'active',
          weight: 100,
          successRate: 0.95,
          costFactor: 1,
        },
      });
    }

    return tenant;
  }

  async setStatus(
    tenantId: string,
    status: 'PENDING' | 'ACTIVE' | 'SUSPENDED',
  ) {
    return this.prisma.tenant.update({
      where: { id: tenantId },
      data: { status },
    });
  }

  async approveKyc(tenantId: string) {
    return this.prisma.tenant.update({
      where: { id: tenantId },
      data: { kycApprovedAt: new Date(), status: 'ACTIVE' },
    });
  }
}
