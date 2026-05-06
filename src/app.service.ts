import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHealth() {
    return {
      service: 'polapine-clone-backend',
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }
}
