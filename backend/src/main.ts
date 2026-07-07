import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  const apiPrefix = config.get<string>('app.apiPrefix', 'api');
  app.setGlobalPrefix(apiPrefix);

  app.enableCors({ origin: config.get<string>('app.corsOrigin', '*') });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle('VBG Case Reporting API')
    .setDescription('CSVVDH - Gender-Based Violence case reporting, referral and monitoring API')
    .setVersion('0.1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document);

  const port = config.get<number>('app.port', 3000);
  await app.listen(port);
}

bootstrap().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
