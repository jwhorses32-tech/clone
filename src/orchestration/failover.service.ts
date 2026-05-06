import { Injectable } from '@nestjs/common';
import type { RoutedGateway } from './router.service';

@Injectable()
export class FailoverService {
  /** Yields gateways in order until `tryGateway` returns success or list exhausted. */
  async executeWithFailover<T>(
    gateways: RoutedGateway[],
    tryGateway: (
      g: RoutedGateway,
    ) => Promise<{ ok: boolean; result?: T; error?: string }>,
  ): Promise<{ ok: boolean; result?: T; errors: string[] }> {
    const errors: string[] = [];
    for (const g of gateways) {
      const r = await tryGateway(g);
      if (r.ok) return { ok: true, result: r.result, errors };
      errors.push(r.error ?? 'unknown');
    }
    return { ok: false, errors };
  }
}
