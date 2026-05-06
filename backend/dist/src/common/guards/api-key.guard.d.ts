import { CanActivate, ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';
import { PrismaService } from '../../prisma/prisma.service';
import type { TenantContext } from '../decorators/current-tenant.decorator';
export type ApiKeyRequest = Request & {
    tenant?: TenantContext;
    apiKeyScopes?: string[];
};
export declare class ApiKeyGuard implements CanActivate {
    private readonly prisma;
    constructor(prisma: PrismaService);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
