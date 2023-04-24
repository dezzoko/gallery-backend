import { comparePassword, hashPasword } from 'src/common/utils/bcrypt';
import { UserService } from '../user/user.service';
import { SignupDto } from './dto/sign-up.dto';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { UserEntity } from '../user/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import TokenPayload from 'src/common/interfaces/token-payload';
import { ConfigService } from '@nestjs/config';
import { PostgresErrorCode } from 'prisma/postgresErrorCodes.enum';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}
  public getCookieWithJwtAccessToken(userId: number) {
    console.log(this.configService.get('auth.accessTokenExpiresIn'));

    const payload: TokenPayload = { userId };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('auth.secretAccessToken'),
      expiresIn: this.configService.get('auth.accessTokenExpiresIn'),
    });
    return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get(
      'JWT_ACCESS_TOKEN_EXPIRATION_TIME',
    )}`;
  }

  public getCookieWithJwtRefreshToken(userId: number) {
    const payload: TokenPayload = { userId };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('auth.secretRefreshToken'),
      expiresIn: `${this.configService.get('auth.refreshTokenExpiresIn')}`,
    });
    const cookie = `Refresh=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get(
      'auth.refreshTokenExpiresIn',
    )}`;
    return {
      cookie,
      token,
    };
  }

  public async signUp(signUpDto: SignupDto) {
    const hashedPassword = await hashPasword(signUpDto.password);
    delete signUpDto.confirmPassword;
    try {
      const createdUser = await this.userService.createUser({
        ...signUpDto,
        password: hashedPassword,
      });

      return createdUser;
    } catch (error) {
      if (error?.code === PostgresErrorCode.UniqueViolation) {
        throw new HttpException(
          'User with that email already exists',
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async getAuthenticatedUser(email: string, plainTextPassword: string) {
    try {
      const user = await this.userService.getByEmail(email);
      this.verifyPassword(plainTextPassword, user.password);
      return UserEntity.fromObject(user);
    } catch (error) {
      throw new HttpException(
        'Wrong credentials provided',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  public getCookieForLogOut() {
    return `Authentication=; HttpOnly; Path=/; Max-Age=0`;
  }

  private verifyPassword(plainTextPassword: string, hashedPassword: string) {
    const isPasswordMatching = comparePassword(
      plainTextPassword,
      hashedPassword,
    );
    if (!isPasswordMatching) {
      throw new HttpException(
        'Wrong credentials provided',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
