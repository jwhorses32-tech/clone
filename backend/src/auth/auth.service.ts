import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as argon2 from 'argon2';
import { randomBytes } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { MailerService } from '../notifications/mailer.service';
import type { JwtPayload } from './jwt-payload';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
    private readonly mailer: MailerService,
  ) {}

  async register(data: {
    email: string;
    password: string;
    pin: string;
    displayName: string;
  }) {
    const existing = await this.prisma.user.findUnique({
      where: { email: data.email.toLowerCase() },
    });
    if (existing) throw new ConflictException('Email already registered');

    const passwordHash = await argon2.hash(data.password);
    const pinHash = await argon2.hash(data.pin);
    const emailVerificationToken = randomBytes(32).toString('hex');

    const user = await this.prisma.user.create({
      data: {
        email: data.email.toLowerCase(),
        displayName: data.displayName,
        passwordHash,
        pinHash,
        emailVerificationToken,
      },
    });

    const appUrl = this.config.get<string>(
      'FRONTEND_URL',
      'http://localhost:3000',
    );
    await this.mailer.send({
      to: user.email,
      subject: 'Verify your email',
      text: `Verify: ${appUrl}/verify-email?token=${emailVerificationToken}`,
      html: `<p><a href="${appUrl}/verify-email?token=${emailVerificationToken}">Verify email</a></p>`,
    });

    return {
      id: user.id,
      email: user.email,
      message: 'Check your email to verify your account.',
    };
  }

  async login(
    email: string,
    password: string,
  ): Promise<{ access_token: string; user: JwtPayload }> {
    const user = await this.prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });
    if (!user?.passwordHash)
      throw new UnauthorizedException('Invalid credentials');
    const ok = await argon2.verify(user.passwordHash, password);
    if (!ok) throw new UnauthorizedException('Invalid credentials');
    if (!user.isActive) throw new UnauthorizedException('Account disabled');

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };
    const access_token = await this.jwt.signAsync(payload);
    return { access_token, user: payload };
  }

  async me(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        displayName: true,
        emailVerifiedAt: true,
        role: true,
        createdAt: true,
      },
    });
  }

  async verifyEmail(token: string) {
    const user = await this.prisma.user.findFirst({
      where: { emailVerificationToken: token },
    });
    if (!user) throw new BadRequestException('Invalid or expired token');
    await this.prisma.user.update({
      where: { id: user.id },
      data: { emailVerifiedAt: new Date(), emailVerificationToken: null },
    });
    return { ok: true };
  }

  async resendVerification(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });
    if (!user) return { ok: true };
    if (user.emailVerifiedAt) return { ok: true };
    const emailVerificationToken = randomBytes(32).toString('hex');
    await this.prisma.user.update({
      where: { id: user.id },
      data: { emailVerificationToken },
    });
    const appUrl = this.config.get<string>(
      'FRONTEND_URL',
      'http://localhost:3000',
    );
    await this.mailer.send({
      to: user.email,
      subject: 'Verify your email',
      text: `Verify: ${appUrl}/verify-email?token=${emailVerificationToken}`,
    });
    return { ok: true };
  }

  async forgotPassword(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });
    if (!user) return { ok: true };
    const token = randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 60 * 60 * 1000);
    await this.prisma.user.update({
      where: { id: user.id },
      data: { passwordResetToken: token, passwordResetExpires: expires },
    });
    const appUrl = this.config.get<string>(
      'FRONTEND_URL',
      'http://localhost:3000',
    );
    await this.mailer.send({
      to: user.email,
      subject: 'Reset your password',
      text: `Reset: ${appUrl}/reset-password?token=${token}`,
    });
    return { ok: true };
  }

  async resetPassword(token: string, password: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        passwordResetToken: token,
        passwordResetExpires: { gt: new Date() },
      },
    });
    if (!user) throw new BadRequestException('Invalid or expired token');
    const passwordHash = await argon2.hash(password);
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash,
        passwordResetToken: null,
        passwordResetExpires: null,
      },
    });
    return { ok: true };
  }

  async forgotPin(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });
    if (!user) return { ok: true };
    const token = randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 60 * 60 * 1000);
    await this.prisma.user.update({
      where: { id: user.id },
      data: { pinResetToken: token, pinResetExpires: expires },
    });
    const appUrl = this.config.get<string>(
      'FRONTEND_URL',
      'http://localhost:3000',
    );
    await this.mailer.send({
      to: user.email,
      subject: 'Reset your PIN',
      text: `Reset PIN: ${appUrl}/reset-pin?token=${token}`,
    });
    return { ok: true };
  }

  async resetPin(token: string, pin: string) {
    const user = await this.prisma.user.findFirst({
      where: { pinResetToken: token, pinResetExpires: { gt: new Date() } },
    });
    if (!user) throw new BadRequestException('Invalid or expired token');
    const pinHash = await argon2.hash(pin);
    await this.prisma.user.update({
      where: { id: user.id },
      data: { pinHash, pinResetToken: null, pinResetExpires: null },
    });
    return { ok: true };
  }
}
