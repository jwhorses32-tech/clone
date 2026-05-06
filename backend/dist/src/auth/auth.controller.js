"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const register_dto_1 = require("./dto/register.dto");
const login_dto_1 = require("./dto/login.dto");
const forgot_password_dto_1 = require("./dto/forgot-password.dto");
const reset_password_dto_1 = require("./dto/reset-password.dto");
const forgot_pin_dto_1 = require("./dto/forgot-pin.dto");
const reset_pin_dto_1 = require("./dto/reset-pin.dto");
const resend_verification_dto_1 = require("./dto/resend-verification.dto");
const verify_email_dto_1 = require("./dto/verify-email.dto");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const constants_1 = require("../common/constants");
const config_1 = require("@nestjs/config");
let AuthController = class AuthController {
    auth;
    config;
    constructor(auth, config) {
        this.auth = auth;
        this.config = config;
    }
    register(dto) {
        return this.auth.register(dto);
    }
    async login(dto, res) {
        const { access_token, user } = await this.auth.login(dto.email, dto.password);
        const secure = this.config.get('NODE_ENV') === 'production';
        res.cookie(constants_1.COOKIE_ACCESS_TOKEN, access_token, {
            httpOnly: true,
            secure,
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: '/',
        });
        return { user, access_token };
    }
    logout(res) {
        res.clearCookie(constants_1.COOKIE_ACCESS_TOKEN, { path: '/' });
        return { ok: true };
    }
    me(user) {
        if (!user)
            return null;
        return this.auth.me(user.sub);
    }
    verifyEmail(dto) {
        return this.auth.verifyEmail(dto.token);
    }
    resend(dto) {
        return this.auth.resendVerification(dto.email);
    }
    forgotPassword(dto) {
        return this.auth.forgotPassword(dto.email);
    }
    resetPassword(dto) {
        return this.auth.resetPassword(dto.token, dto.password);
    }
    forgotPin(dto) {
        return this.auth.forgotPin(dto.email);
    }
    resetPin(dto) {
        return this.auth.resetPin(dto.token, dto.pin);
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('register'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [register_dto_1.RegisterDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.LoginDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('logout'),
    __param(0, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "logout", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('me'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "me", null);
__decorate([
    (0, common_1.Post)('verify-email'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [verify_email_dto_1.VerifyEmailDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "verifyEmail", null);
__decorate([
    (0, common_1.Post)('resend-verification'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [resend_verification_dto_1.ResendVerificationDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "resend", null);
__decorate([
    (0, common_1.Post)('forgot-password'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [forgot_password_dto_1.ForgotPasswordDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "forgotPassword", null);
__decorate([
    (0, common_1.Post)('reset-password'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [reset_password_dto_1.ResetPasswordDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "resetPassword", null);
__decorate([
    (0, common_1.Post)('forgot-pin'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [forgot_pin_dto_1.ForgotPinDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "forgotPin", null);
__decorate([
    (0, common_1.Post)('reset-pin'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [reset_pin_dto_1.ResetPinDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "resetPin", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        config_1.ConfigService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map