import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
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
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { JwtPayload } from './jwt-payload';
import { COOKIE_ACCESS_TOKEN } from '../common/constants';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly auth: AuthService,
    private readonly config: ConfigService,
  ) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.auth.register(dto);
  }

  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { access_token, user } = await this.auth.login(
      dto.email,
      dto.password,
    );
    const secure = this.config.get<string>('NODE_ENV') === 'production';
    res.cookie(COOKIE_ACCESS_TOKEN, access_token, {
      httpOnly: true,
      secure,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/',
    });
    /** Also return JWT for SPA on a different origin (e.g. Next on :3000, API on :3001). Prefer httpOnly cookie when same-site. */
    return { user, access_token };
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie(COOKIE_ACCESS_TOKEN, { path: '/' });
    return { ok: true };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@CurrentUser() user: JwtPayload | undefined) {
    if (!user) return null;
    return this.auth.me(user.sub);
  }

  @Post('verify-email')
  verifyEmail(@Body() dto: VerifyEmailDto) {
    return this.auth.verifyEmail(dto.token);
  }

  @Post('resend-verification')
  resend(@Body() dto: ResendVerificationDto) {
    return this.auth.resendVerification(dto.email);
  }

  @Post('forgot-password')
  forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.auth.forgotPassword(dto.email);
  }

  @Post('reset-password')
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.auth.resetPassword(dto.token, dto.password);
  }

  @Post('forgot-pin')
  forgotPin(@Body() dto: ForgotPinDto) {
    return this.auth.forgotPin(dto.email);
  }

  @Post('reset-pin')
  resetPin(@Body() dto: ResetPinDto) {
    return this.auth.resetPin(dto.token, dto.pin);
  }
}
