import {
  CanActivate,
  ExecutionContext,
  Injectable,
  BadRequestException,
} from '@nestjs/common';
import type { Request } from 'express';
import { PrismaService } from '../../prisma/prisma.service';
import type { JwtPayload } from '../../auth/jwt-payload';
import type { TenantContext } from '../decorators/current-tenant.decorator';

/**
 * Expects header X-Tenant-Id or query tenantId. Attaches membership to request.
 */
@Injectable()
export class TenantGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context
      .switchToHttp()
      .getRequest<Request & { user?: JwtPayload; tenant?: TenantContext }>();
    const user = req.user;
    if (!user) return false;

    const tenantId =
      (req.headers['x-tenant-id'] as string | undefined) ??
      (req.query['tenantId'] as string | undefined);
    if (!tenantId) {
      throw new BadRequestException(
        'X-Tenant-Id header or tenantId query required',
      );
    }

    const membership = await this.prisma.membership.findUnique({
      where: { userId_tenantId: { userId: user.sub, tenantId } },
    });
    if (!membership) {
      return false;
    }

    req.tenant = { tenantId, membershipRole: membership.role };
    return true;
  }
}
