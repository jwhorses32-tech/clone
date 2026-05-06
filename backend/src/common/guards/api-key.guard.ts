import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as argon2 from 'argon2';
import type { Request } from 'express';
import { PrismaService } from '../../prisma/prisma.service';
import type { TenantContext } from '../decorators/current-tenant.decorator';

export type ApiKeyRequest = Request & {
  tenant?: TenantContext;
  apiKeyScopes?: string[];
};

/**
 * Validates X-API-Key (pk_*) + X-API-Secret (sk_* raw once stored as hash).
 */
@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<ApiKeyRequest>();
    const pk = req.headers['x-api-key'] as string | undefined;
    const sk = req.headers['x-api-secret'] as string | undefined;
    if (!pk?.startsWith('pk_') || !sk?.startsWith('sk_')) {
      throw new UnauthorizedException('Invalid API credentials');
    }

    const key = await this.prisma.apiKey.findUnique({
      where: { publicKey: pk },
      include: { tenant: true },
    });
    if (!key || key.revokedAt) {
      throw new UnauthorizedException('Invalid API key');
    }

    const ok = await argon2.verify(key.secretHash, sk);
    if (!ok) {
      throw new UnauthorizedException('Invalid API secret');
    }

    void this.prisma.apiKey.update({
      where: { id: key.id },
      data: { lastUsedAt: new Date() },
    });

    req.tenant = { tenantId: key.tenantId, membershipRole: 'API' };
    req.apiKeyScopes = key.scopes;
    return true;
  }
}
