import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { LocalStrategy } from './strategies/local.strategy';
import { UserModule } from '../user/user.module';
import { AuthService } from './auth.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JWT_SERVICE } from 'src/common/constants/tokens';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { APP_GUARD } from '@nestjs/core/constants';

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('auth.secretAccessToken'),
        signOptions: {
          expiresIn: configService.get('auth.accessTokenExpiresIn'),
        },
      }),
    }),
  ],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
  controllers: [AuthController],
})
export class AuthModule {}
