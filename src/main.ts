import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { RemoveFieldsInterceptor } from './common/interceptors/remove-fields.interceptor';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalInterceptors(
    new RemoveFieldsInterceptor(['password', 'currentHashedRefreshToken']),
  );
  await app.listen(3000);
}
bootstrap();
