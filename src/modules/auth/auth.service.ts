import { comparePassword, hashPasword } from 'src/common/utils/bcrypt';
import { UserService } from '../user/user.service';
import { SignupDto } from './dto/sign-up.dto';
import { HttpException, HttpStatus } from '@nestjs/common';
import { UserEntity } from '../user/entities/user.entity';

export class AuthService {
  constructor(private readonly usersService: UserService) {}

  public async signUp(signUpDto: SignupDto) {
    const hashedPassword = await hashPasword(signUpDto.password);
    try {
      const createdUser = await this.usersService.createUser({
        ...signUpDto,
        password: hashedPassword,
      });
      createdUser.password = undefined;
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
      const user = await this.usersService.getByEmail(email);
      this.verifyPassword(plainTextPassword, user.password);
      return UserEntity.fromObject(user);
    } catch (error) {
      throw new HttpException(
        'Wrong credentials provided',
        HttpStatus.BAD_REQUEST,
      );
    }
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
