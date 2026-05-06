import { ConfigService } from '@nestjs/config';
import type Mail from 'nodemailer/lib/mailer';
export declare class MailerService {
    private readonly config;
    private readonly logger;
    private transporter;
    constructor(config: ConfigService);
    send(options: Mail.Options): Promise<void>;
}
