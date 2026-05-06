"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const argon2 = __importStar(require("argon2"));
const crypto_1 = require("crypto");
const prisma_service_1 = require("../prisma/prisma.service");
const mailer_service_1 = require("../notifications/mailer.service");
let AuthService = class AuthService {
    prisma;
    jwt;
    config;
    mailer;
    constructor(prisma, jwt, config, mailer) {
        this.prisma = prisma;
        this.jwt = jwt;
        this.config = config;
        this.mailer = mailer;
    }
    async register(data) {
        const existing = await this.prisma.user.findUnique({
            where: { email: data.email.toLowerCase() },
        });
        if (existing)
            throw new common_1.ConflictException('Email already registered');
        const passwordHash = await argon2.hash(data.password);
        const pinHash = await argon2.hash(data.pin);
        const emailVerificationToken = (0, crypto_1.randomBytes)(32).toString('hex');
        const user = await this.prisma.user.create({
            data: {
                email: data.email.toLowerCase(),
                displayName: data.displayName,
                passwordHash,
                pinHash,
                emailVerificationToken,
            },
        });
        const appUrl = this.config.get('FRONTEND_URL', 'http://localhost:3000');
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
    async login(email, password) {
        const user = await this.prisma.user.findUnique({
            where: { email: email.toLowerCase() },
        });
        if (!user?.passwordHash)
            throw new common_1.UnauthorizedException('Invalid credentials');
        const ok = await argon2.verify(user.passwordHash, password);
        if (!ok)
            throw new common_1.UnauthorizedException('Invalid credentials');
        if (!user.isActive)
            throw new common_1.UnauthorizedException('Account disabled');
        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role,
        };
        const access_token = await this.jwt.signAsync(payload);
        return { access_token, user: payload };
    }
    async me(userId) {
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
    async verifyEmail(token) {
        const user = await this.prisma.user.findFirst({
            where: { emailVerificationToken: token },
        });
        if (!user)
            throw new common_1.BadRequestException('Invalid or expired token');
        await this.prisma.user.update({
            where: { id: user.id },
            data: { emailVerifiedAt: new Date(), emailVerificationToken: null },
        });
        return { ok: true };
    }
    async resendVerification(email) {
        const user = await this.prisma.user.findUnique({
            where: { email: email.toLowerCase() },
        });
        if (!user)
            return { ok: true };
        if (user.emailVerifiedAt)
            return { ok: true };
        const emailVerificationToken = (0, crypto_1.randomBytes)(32).toString('hex');
        await this.prisma.user.update({
            where: { id: user.id },
            data: { emailVerificationToken },
        });
        const appUrl = this.config.get('FRONTEND_URL', 'http://localhost:3000');
        await this.mailer.send({
            to: user.email,
            subject: 'Verify your email',
            text: `Verify: ${appUrl}/verify-email?token=${emailVerificationToken}`,
        });
        return { ok: true };
    }
    async forgotPassword(email) {
        const user = await this.prisma.user.findUnique({
            where: { email: email.toLowerCase() },
        });
        if (!user)
            return { ok: true };
        const token = (0, crypto_1.randomBytes)(32).toString('hex');
        const expires = new Date(Date.now() + 60 * 60 * 1000);
        await this.prisma.user.update({
            where: { id: user.id },
            data: { passwordResetToken: token, passwordResetExpires: expires },
        });
        const appUrl = this.config.get('FRONTEND_URL', 'http://localhost:3000');
        await this.mailer.send({
            to: user.email,
            subject: 'Reset your password',
            text: `Reset: ${appUrl}/reset-password?token=${token}`,
        });
        return { ok: true };
    }
    async resetPassword(token, password) {
        const user = await this.prisma.user.findFirst({
            where: {
                passwordResetToken: token,
                passwordResetExpires: { gt: new Date() },
            },
        });
        if (!user)
            throw new common_1.BadRequestException('Invalid or expired token');
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
    async forgotPin(email) {
        const user = await this.prisma.user.findUnique({
            where: { email: email.toLowerCase() },
        });
        if (!user)
            return { ok: true };
        const token = (0, crypto_1.randomBytes)(32).toString('hex');
        const expires = new Date(Date.now() + 60 * 60 * 1000);
        await this.prisma.user.update({
            where: { id: user.id },
            data: { pinResetToken: token, pinResetExpires: expires },
        });
        const appUrl = this.config.get('FRONTEND_URL', 'http://localhost:3000');
        await this.mailer.send({
            to: user.email,
            subject: 'Reset your PIN',
            text: `Reset PIN: ${appUrl}/reset-pin?token=${token}`,
        });
        return { ok: true };
    }
    async resetPin(token, pin) {
        const user = await this.prisma.user.findFirst({
            where: { pinResetToken: token, pinResetExpires: { gt: new Date() } },
        });
        if (!user)
            throw new common_1.BadRequestException('Invalid or expired token');
        const pinHash = await argon2.hash(pin);
        await this.prisma.user.update({
            where: { id: user.id },
            data: { pinHash, pinResetToken: null, pinResetExpires: null },
        });
        return { ok: true };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        config_1.ConfigService,
        mailer_service_1.MailerService])
], AuthService);
//# sourceMappingURL=auth.service.js.map