import { Inject, Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { USER_REPOSITORY } from 'src/common/constants/tokens';
import { CreateUserDto } from './dto/create-user.dto';
import { compare } from 'bcrypt';
import { AddRoleToUserDto } from './dto/addRoleToUserDto.dto';

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

  async getByEmail(email: string) {
    return await this.userRepository.getByEmail(email);
  }

  async getUserIfRefreshTokenMatches(refreshToken: string, userId: number) {
    const user = await this.userRepository.getById(userId);

    const isRefreshTokenMatching = await compare(
      refreshToken,
      user.currentHashedRefreshToken,
    );

    if (isRefreshTokenMatching) {
      return user;
    }
  }

  async getAll() {
    return await this.userRepository.getAll();
  }

  async addRoleToUser(addRoleToUserDto: AddRoleToUserDto) {
    return await this.userRepository.addRoleToUser(
      addRoleToUserDto.userId,
      addRoleToUserDto.roleName,
    );
  }

  async createUser(createUserDto: CreateUserDto) {
    return await this.userRepository.create(createUserDto);
  }
}
