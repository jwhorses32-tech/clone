import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import type Mail from 'nodemailer/lib/mailer';

@Injectable()
export class MailerService {
  private readonly logger = new Logger(MailerService.name);
  private transporter: nodemailer.Transporter;

  constructor(private readonly config: ConfigService) {
    const host = this.config.get<string>('SMTP_HOST', 'localhost');
    const port = Number(this.config.get<string>('SMTP_PORT', '1025'));
    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure: false,
    });
  }

  async send(options: Mail.Options): Promise<void> {
    const from = this.config.get<string>(
      'MAIL_FROM',
      'Polapine Clone <noreply@localhost>',
    );
    try {
      await this.transporter.sendMail({ from, ...options });
    } catch (e) {
      this.logger.warn(`Mail send failed: ${(e as Error).message}`);
    }
  }
}
