import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { RemoveFieldsInterceptor } from './common/interceptors/remove-fields.interceptor';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(
    new RemoveFieldsInterceptor([
      'password',
      'currentHashedRefreshToken',
      'isBlocked',
    ]),
  );
  await app.listen(3000);
}
bootstrap();
