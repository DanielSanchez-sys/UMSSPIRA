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

  // Toma el puerto dinámico de la plataforma o usa 3000 por defecto en local
  const port = process.env.PORT || 3000;

  // '0.0.0.0' permite que la API escuche las peticiones en el servidor
  await app.listen(port, '0.0.0.0');

  console.log(`API ejecutándose en el puerto ${port}`);
}

bootstrap();