import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ExpressAdapter } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, new ExpressAdapter());

  app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
  app.use(cookieParser());

  const frontendUrls = (process.env.FRONTEND_URL ?? 'http://localhost:3000')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  app.enableCors({
    origin: [
      ...frontendUrls,
      /^http:\/\/localhost:\d+$/,
      /^https:\/\/[\w.-]+\.ngrok-free\.app$/,
      /^https:\/\/[\w.-]+\.ngrok-free\.dev$/,
      /^https:\/\/[\w.-]+\.railway\.app$/,
    ],
    credentials: true,
  });

  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Polapine Clone API')
    .setDescription('REST API v4.1 — payment orchestration')
    .setVersion('4.1')
    .addApiKey({ type: 'apiKey', name: 'X-API-Key', in: 'header' })
    .addApiKey({ type: 'apiKey', name: 'X-API-Secret', in: 'header' })
    .addCookieAuth('access_token')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(process.env.PORT ?? 3001);
}
void bootstrap();
