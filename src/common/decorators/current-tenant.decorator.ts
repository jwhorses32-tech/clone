import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';

export type TenantContext = { tenantId: string; membershipRole: string };

export const CurrentTenant = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): TenantContext | undefined => {
    const req = ctx
      .switchToHttp()
      .getRequest<Request & { tenant?: TenantContext }>();
    return req.tenant;
  },
);
