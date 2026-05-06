import type { Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ForgotPinDto } from './dto/forgot-pin.dto';
import { ResetPinDto } from './dto/reset-pin.dto';
import { ResendVerificationDto } from './dto/resend-verification.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import type { JwtPayload } from './jwt-payload';
import { ConfigService } from '@nestjs/config';
export declare class AuthController {
    private readonly auth;
    private readonly config;
    constructor(auth: AuthService, config: ConfigService);
    register(dto: RegisterDto): Promise<{
        id: string;
        email: string;
        message: string;
    }>;
    login(dto: LoginDto, res: Response): Promise<{
        user: JwtPayload;
        access_token: string;
    }>;
    logout(res: Response): {
        ok: boolean;
    };
    me(user: JwtPayload | undefined): Promise<{
        id: string;
        email: string;
        displayName: string | null;
        emailVerifiedAt: Date | null;
        role: import("@prisma/client").$Enums.UserRole;
        createdAt: Date;
    } | null> | null;
    verifyEmail(dto: VerifyEmailDto): Promise<{
        ok: boolean;
    }>;
    resend(dto: ResendVerificationDto): Promise<{
        ok: boolean;
    }>;
    forgotPassword(dto: ForgotPasswordDto): Promise<{
        ok: boolean;
    }>;
    resetPassword(dto: ResetPasswordDto): Promise<{
        ok: boolean;
    }>;
    forgotPin(dto: ForgotPinDto): Promise<{
        ok: boolean;
    }>;
    resetPin(dto: ResetPinDto): Promise<{
        ok: boolean;
    }>;
}
