import { Injectable, NotFoundException } from '@nestjs/common';
import { randomBytes } from 'crypto';
import * as argon2 from 'argon2';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ApiKeysService {
  constructor(private readonly prisma: PrismaService) {}

  async list(tenantId: string) {
    return this.prisma.apiKey.findMany({
      where: { tenantId, revokedAt: null },
      select: {
        id: true,
        publicKey: true,
        name: true,
        scopes: true,
        lastUsedAt: true,
        createdAt: true,
      },
    });
  }

  async create(tenantId: string, name?: string) {
    const publicKey = `pk_${randomBytes(16).toString('hex')}`;
    const secretRaw = `sk_${randomBytes(32).toString('hex')}`;
    const secretHash = await argon2.hash(secretRaw);
    await this.prisma.apiKey.create({
      data: {
        tenantId,
        publicKey,
        secretHash,
        name,
        scopes: ['read', 'write'],
      },
    });
    return { publicKey, secretKey: secretRaw };
  }

  async revoke(tenantId: string, id: string) {
    const k = await this.prisma.apiKey.findFirst({ where: { id, tenantId } });
    if (!k) throw new NotFoundException();
    return this.prisma.apiKey.update({
      where: { id },
      data: { revokedAt: new Date() },
    });
  }
}
