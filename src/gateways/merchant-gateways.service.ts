import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EncryptionService } from '../common/encryption.service';
import { GatewayRegistryService } from './gateway-registry.service';

@Injectable()
export class MerchantGatewaysService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly encryption: EncryptionService,
    private readonly registry: GatewayRegistryService,
  ) {}

  async list(tenantId: string) {
    return this.prisma.merchantGateway.findMany({
      where: { tenantId },
      include: { gateway: true },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async connect(
    tenantId: string,
    gatewayCode: string,
    credentials: Record<string, unknown>,
  ) {
    const adapter = this.registry.get(gatewayCode);
    if (!adapter)
      throw new BadRequestException(`Unknown gateway: ${gatewayCode}`);

    const gateway = await this.prisma.gateway.findUnique({
      where: { code: gatewayCode },
    });
    if (!gateway)
      throw new NotFoundException('Gateway not registered in catalog');

    const encryptedCreds = this.encryption.encryptJson(credentials);

    return this.prisma.merchantGateway.upsert({
      where: { tenantId_gatewayId: { tenantId, gatewayId: gateway.id } },
      create: {
        tenantId,
        gatewayId: gateway.id,
        encryptedCreds,
        status: 'active',
      },
      update: { encryptedCreds, status: 'active' },
      include: { gateway: true },
    });
  }

  decryptCredentials(encryptedCreds: string): Record<string, unknown> {
    return this.encryption.decryptJson<Record<string, unknown>>(encryptedCreds);
  }
}
