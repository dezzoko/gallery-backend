import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { MediaPostModule } from './modules/media-post/media-post.module';
import { UserModule } from './modules/user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import authConfig from './config/auth.config';
import { AuthModule } from './modules/auth/auth.module';

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
  providers: [],
})
export class AppModule {}
