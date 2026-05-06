import { InvoicesService } from '../invoices/invoices.service';
import { TransactionsService } from '../transactions/transactions.service';
declare class CompleteCheckoutDto {
    email?: string;
    deviceFingerprint?: string;
}
export declare class CheckoutController {
    private readonly invoices;
    private readonly txns;
    constructor(invoices: InvoicesService, txns: TransactionsService);
    getOne(hostedPath: string): Promise<{
        amount_cents: number;
        currency: string;
        brand: string;
        order_reference: string | null;
    }>;
    complete(hostedPath: string, body: CompleteCheckoutDto, ip: string): Promise<{
        ok: boolean;
        transaction_id: string;
    }>;
}
export {};
