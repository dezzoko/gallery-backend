import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { MediaPostModule } from './modules/media-post/media-post.module';
import { UserModule } from './modules/user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import authConfig from './config/auth.config';
import { AuthModule } from './modules/auth/auth.module';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { RemoveNullValuesInterceptor } from './common/interceptors/remove-null-fields.interceptor';
import { RolesGuard } from './common/guards/role.guard';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { MailingController } from './modules/mailing/mailing.controller';
import { MailingService } from './modules/mailing/mailing.service';
import { MailingModule } from './modules/mailing/mailing.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENVIRONMENT}.env`,
      isGlobal: true,
      load: [authConfig],
    }),
    MailerModule.forRoot({
      transport: 'smtps://user@domain.com:pass@smtp.domain.com',
    }),
    PrismaModule,
    MediaPostModule,
    UserModule,
    AuthModule,
    MailingModule,
  ],
  controllers: [MailingController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: RemoveNullValuesInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    MailingService,
  ],
})
export class AppModule {}
