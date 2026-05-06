"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const helmet_1 = __importDefault(require("helmet"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, new platform_express_1.ExpressAdapter());
    app.use((0, helmet_1.default)({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
    app.use((0, cookie_parser_1.default)());
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
        ],
        credentials: true,
    });
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
    }));
    const swaggerConfig = new swagger_1.DocumentBuilder()
        .setTitle('Polapine Clone API')
        .setDescription('REST API v4.1 — payment orchestration')
        .setVersion('4.1')
        .addApiKey({ type: 'apiKey', name: 'X-API-Key', in: 'header' })
        .addApiKey({ type: 'apiKey', name: 'X-API-Secret', in: 'header' })
        .addCookieAuth('access_token')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, swaggerConfig);
    swagger_1.SwaggerModule.setup('api/docs', app, document);
    await app.listen(process.env.PORT ?? 3001);
}
void bootstrap();
//# sourceMappingURL=main.js.map