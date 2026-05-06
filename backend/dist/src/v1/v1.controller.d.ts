import type { Request } from 'express';
import { InvoicesService } from '../invoices/invoices.service';
import { CreateInvoiceV1Dto } from './dto/create-invoice-v1.dto';
export declare class V1Controller {
    private readonly invoices;
    constructor(invoices: InvoicesService);
    health(): {
        ok: boolean;
        version: string;
        service: string;
    };
    createInvoice(req: Request, dto: CreateInvoiceV1Dto): Promise<{
        data: {
            invoice_id: string;
            payment_url: string;
            expires_at: string | null;
            transaction_id?: undefined;
        };
    } | {
        data: {
            invoice_id: string;
            transaction_id: string;
            payment_url: string;
            expires_at: string;
        };
    }>;
}
