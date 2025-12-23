import * as dotenv from 'dotenv';
import * as path from 'path';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

// Load envs: root shared first, then backend-specific (backend overrides root)
dotenv.config({ path: path.join(__dirname, '../../.env.local') });
dotenv.config({ path: path.join(__dirname, '../../.env') });
dotenv.config({ path: path.join(__dirname, '../.env.local') });
dotenv.config({ path: path.join(__dirname, '../.env') });

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const allowedOrigins = [
    process.env.FRONTEND_URL || 'http://localhost:3000',
    process.env.FRONTEND_URL_ALT || '',
    'https://flex-living-frontend-mu.vercel.app',
  ].filter(Boolean);

  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
  });

  app.setGlobalPrefix('api');

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`Backend server running on http://localhost:${port}`);
}

bootstrap();
