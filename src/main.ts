import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { RemoveFieldsInterceptor } from './common/interceptors/remove-fields.interceptor';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { MinioService } from './modules/minio/minio.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalInterceptors(
    new RemoveFieldsInterceptor(['password', 'currentHashedRefreshToken']),
  );
  app.enableCors({
    origin: 'http://localhost:5173',
    credentials: true,
  });
  const swaggerConfig = new DocumentBuilder()
    .setTitle('gallery-api')
    .setDescription('gallery-api with permissions')
    .setVersion('1.0')
    .build();
  const minioService = app.get<MinioService>(MinioService);
  await minioService.createBucket();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);
  await app.listen(3000);
}
bootstrap();
