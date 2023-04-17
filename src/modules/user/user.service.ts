import { Inject, Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { USER_REPOSITORY } from 'src/common/constants/tokens';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: UserRepository,
  ) {}

  async setCurrentRefreshToken(refreshToken: string, userId: number) {
    return await this.userRepository.setCurrentRefreshToken(
      refreshToken,
      userId,
    );
  }
  async getById(id: number) {
    return await this.userRepository.getById(id);
  }

  async getByEmail(email) {
    return await this.userRepository.getByEmail(email);
  }

  async createUser(createUserDto: CreateUserDto) {
    return await this.userRepository.create(createUserDto);
  }
}
