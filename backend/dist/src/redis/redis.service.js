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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var RedisService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisService = void 0;
const common_1 = require("@nestjs/common");
const ioredis_1 = __importDefault(require("ioredis"));
let RedisService = RedisService_1 = class RedisService {
    logger = new common_1.Logger(RedisService_1.name);
    client;
    constructor() {
        const url = process.env.REDIS_URL;
        if (!url) {
            this.logger.warn('REDIS_URL not set — idempotency and blocklist use in-memory fallback');
            this.client = null;
            return;
        }
        this.client = new ioredis_1.default(url, { maxRetriesPerRequest: null });
    }
    memSets = new Map();
    memKv = new Map();
    async setNxEx(key, value, ttlSec) {
        if (this.client) {
            const r = await this.client.set(key, value, 'EX', ttlSec, 'NX');
            return r === 'OK';
        }
        if (this.memKv.has(key))
            return false;
        this.memKv.set(key, value);
        setTimeout(() => this.memKv.delete(key), ttlSec * 1000).unref?.();
        return true;
    }
    async sadd(key, ...members) {
        if (this.client) {
            await this.client.sadd(key, ...members);
            return;
        }
        let s = this.memSets.get(key);
        if (!s) {
            s = new Set();
            this.memSets.set(key, s);
        }
        members.forEach((m) => s.add(m));
    }
    async sismember(key, member) {
        if (this.client)
            return this.client.sismember(key, member);
        return this.memSets.get(key)?.has(member) ? 1 : 0;
    }
    async srem(key, ...members) {
        if (this.client) {
            await this.client.srem(key, ...members);
            return;
        }
        const s = this.memSets.get(key);
        if (!s)
            return;
        members.forEach((m) => s.delete(m));
    }
    onModuleDestroy() {
        void this.client?.quit();
    }
};
exports.RedisService = RedisService;
exports.RedisService = RedisService = RedisService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], RedisService);
//# sourceMappingURL=redis.service.js.map