import { ConfigService } from '@nestjs/config';
export declare class EncryptionService {
    private readonly config;
    private readonly key;
    constructor(config: ConfigService);
    encryptJson(obj: Record<string, unknown>): string;
    decryptJson<T extends Record<string, unknown>>(payload: string): T;
}
