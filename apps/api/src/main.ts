import * as dotenv from 'dotenv';
import * as path from 'path';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  dotenv.config({
    path: path.resolve(__dirname, '../../../.env'),
  });

  const { AppModule } = await import('./app.module');

  const app = await NestFactory.create(AppModule);

  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.listen(3000);

  console.log('API ejecutándose en http://localhost:3000');
}

bootstrap();