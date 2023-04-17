import {
  Body,
  Controller,
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

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private userService: UserService,
  ) {}

  @HttpCode(200)
  @UseGuards(LocalAuthGuard)
  @Post('log-in')
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

  @Post('logout')
  async logOut(@Req() request: RequestWithUser, @Res() response: Response) {
    response.setHeader('Set-Cookie', this.authService.getCookieForLogOut());
    return response.sendStatus(200);
  }
  @Post('register')
  async register(@Body() signUpDto: SignupDto) {
    return this.authService.signUp(signUpDto);
  }

  @HttpCode(200)
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async logIn(@Req() request: RequestWithUser) {
    const user = request.user;
    user.password = undefined;
    return user;
  }
}
