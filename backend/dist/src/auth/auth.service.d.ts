import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { MailerService } from '../notifications/mailer.service';
import type { JwtPayload } from './jwt-payload';
export declare class AuthService {
    private readonly prisma;
    private readonly jwt;
    private readonly config;
    private readonly mailer;
    constructor(prisma: PrismaService, jwt: JwtService, config: ConfigService, mailer: MailerService);
    register(data: {
        email: string;
        password: string;
        pin: string;
        displayName: string;
    }): Promise<{
        id: string;
        email: string;
        message: string;
    }>;
    login(email: string, password: string): Promise<{
        access_token: string;
        user: JwtPayload;
    }>;
    me(userId: string): Promise<{
        id: string;
        email: string;
        displayName: string | null;
        emailVerifiedAt: Date | null;
        role: import("@prisma/client").$Enums.UserRole;
        createdAt: Date;
    } | null>;
    verifyEmail(token: string): Promise<{
        ok: boolean;
    }>;
    resendVerification(email: string): Promise<{
        ok: boolean;
    }>;
    forgotPassword(email: string): Promise<{
        ok: boolean;
    }>;
    resetPassword(token: string, password: string): Promise<{
        ok: boolean;
    }>;
    forgotPin(email: string): Promise<{
        ok: boolean;
    }>;
    resetPin(token: string, pin: string): Promise<{
        ok: boolean;
    }>;
}
