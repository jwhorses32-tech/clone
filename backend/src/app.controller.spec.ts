import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('health', () => {
    it('should return healthy service payload', () => {
      const response = appController.getHealth();

      expect(response.service).toBe('polapine-clone-backend');
      expect(response.status).toBe('ok');
      expect(typeof response.timestamp).toBe('string');
    });
  });
});
