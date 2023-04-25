import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/sign-up.dto';
import { LocalAuthGuard } from 'src/common/guards/localAuth.guard';
import RequestWithUser from 'src/common/interfaces/request-with-user';
import { Response } from 'express';
import { UserService } from '../user/user.service';
import JwtRefreshGuard from 'src/common/guards/jwt-refresh.guard';
import { MailingService } from '../mailing/mailing.service';
import { NoJwtAuth } from 'src/common/decorators/no-auth.decorator';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly mailingService: MailingService,
  ) {}
  @NoJwtAuth()
  @Post('register')
  async register(@Body() signUpDto: SignupDto) {
    await this.mailingService.sendVerificationLink(signUpDto.email);
    return await this.authService.signUp(signUpDto);
  }

  @HttpCode(200)
  @NoJwtAuth()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() request: RequestWithUser) {
    const { user } = request;
    const accessTokenCookie = this.authService.getCookieWithJwtAccessToken(
      user.id,
    );

    const { cookie: refreshTokenCookie, token: refreshToken } =
      this.authService.getCookieWithJwtRefreshToken(user.id);

    await this.userService.setCurrentRefreshToken(refreshToken, user.id);

    request.res.setHeader('Set-Cookie', [
      accessTokenCookie,
      refreshTokenCookie,
    ]);
    return user;
  }
  @NoJwtAuth()
  @UseGuards(JwtRefreshGuard)
  @Get('refresh')
  refresh(@Req() request: RequestWithUser) {
    const accessTokenCookie = this.authService.getCookieWithJwtAccessToken(
      request.user.id,
    );

    request.res.setHeader('Set-Cookie', accessTokenCookie);
    return request.user;
  }

  @Post('logout')
  async logout(@Req() request: RequestWithUser, @Res() response: Response) {
    response.setHeader('Set-Cookie', this.authService.getCookieForLogOut());
    return response.sendStatus(200);
  }
}
