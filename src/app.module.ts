import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { MediaPostModule } from './modules/media-post/media-post.module';
import { UserModule } from './modules/user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import authConfig from './config/auth.config';
import { AuthModule } from './modules/auth/auth.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { RemoveNullValuesInterceptor } from './common/interceptors/remove-null-fields.interceptor';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENVIRONMENT}.env`,
      isGlobal: true,
      load: [authConfig],
    }),
    PrismaModule,
    MediaPostModule,
    UserModule,
    AuthModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: RemoveNullValuesInterceptor,
    },
  ],
})
export class AppModule {}
