import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
  });

  process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  });

  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const env = app.get(ConfigService);

  const corsOrigin = env.get<string>('CORS_ORIGIN');
  const allowedOrigins = corsOrigin ? corsOrigin.split(',').map(o => o.trim()) : [];

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
  });

  app.useStaticAssets(join(__dirname, '..', 'public'));

  const port = env.get('PORT') || 4002;

  await app.listen(port);
  console.log(`Application running on port: ${port}`);
}
bootstrap();
