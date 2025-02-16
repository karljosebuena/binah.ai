import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as express from 'express';
import { ConfigService } from '@nestjs/config';
import { AllExceptionsFilter } from './shared/filters/exception.filter';
import { LoggerService } from './shared/services/logger.service';

async function bootstrap() {
  const logger = new LoggerService();
  const app = await NestFactory.create(AppModule, {
    logger,
  });
  const configService = app.get(ConfigService);
  
  // Enable CORS
  app.enableCors();
  
  // API versioning
  app.enableVersioning({
    type: VersioningType.URI,
    prefix: 'v',
    defaultVersion: '1',
  });
  
  // Configure global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      enableDebugMessages: process.env.NODE_ENV !== 'production',
      stopAtFirstError: true,
    }),
  );

  // Configure global exception filter
  app.useGlobalFilters(new AllExceptionsFilter(logger));

  // Configure file upload
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  // Setup Swagger
  const config = new DocumentBuilder()
    .setTitle('Binah.ai FCV Analysis API')
    .setDescription('API documentation for Forced Cough Vocalization Analysis')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Start the application
  const port = configService.get('PORT') || 3000;
  await app.listen(port);
  
  console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();
