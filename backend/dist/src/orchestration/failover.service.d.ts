import type { RoutedGateway } from './router.service';
export declare class FailoverService {
    executeWithFailover<T>(gateways: RoutedGateway[], tryGateway: (g: RoutedGateway) => Promise<{
        ok: boolean;
        result?: T;
        error?: string;
    }>): Promise<{
        ok: boolean;
        result?: T;
        errors: string[];
    }>;
}
