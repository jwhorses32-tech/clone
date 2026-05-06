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
Object.defineProperty(exports, "__esModule", { value: true });
exports.EncryptionService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const crypto_1 = require("crypto");
let EncryptionService = class EncryptionService {
    config;
    key;
    constructor(config) {
        this.config = config;
        const secret = this.config.get('ENCRYPTION_KEY') ?? '';
        if (secret.length < 32) {
            throw new Error('ENCRYPTION_KEY must be at least 32 characters');
        }
        this.key = (0, crypto_1.scryptSync)(secret, 'polapine-salt-v1', 32);
    }
    encryptJson(obj) {
        const plaintext = JSON.stringify(obj);
        const iv = (0, crypto_1.randomBytes)(12);
        const cipher = (0, crypto_1.createCipheriv)('aes-256-gcm', this.key, iv);
        const enc = Buffer.concat([
            cipher.update(plaintext, 'utf8'),
            cipher.final(),
        ]);
        const tag = cipher.getAuthTag();
        return Buffer.concat([iv, tag, enc]).toString('base64url');
    }
    decryptJson(payload) {
        const buf = Buffer.from(payload, 'base64url');
        const iv = buf.subarray(0, 12);
        const tag = buf.subarray(12, 28);
        const data = buf.subarray(28);
        const decipher = (0, crypto_1.createDecipheriv)('aes-256-gcm', this.key, iv);
        decipher.setAuthTag(tag);
        const json = Buffer.concat([
            decipher.update(data),
            decipher.final(),
        ]).toString('utf8');
        return JSON.parse(json);
    }
};
exports.EncryptionService = EncryptionService;
exports.EncryptionService = EncryptionService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], EncryptionService);
//# sourceMappingURL=encryption.service.js.map