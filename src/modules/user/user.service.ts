import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { USER_REPOSITORY } from 'src/common/constants/tokens';
import { CreateUserDto } from './dto/create-user.dto';
import { compare } from 'bcrypt';
import { AddRoleToUserDto } from './dto/addRoleToUserDto.dto';
import { BucketNames, MinioService } from '../minio/minio.service';

@Injectable()
export class UserService {
  constructor(
    private readonly minioService: MinioService,
    @Inject(USER_REPOSITORY) private readonly userRepository: UserRepository,
  ) {}

  async setCurrentRefreshToken(refreshToken: string, userId: number) {
    return await this.userRepository.setCurrentRefreshToken(
      refreshToken,
      userId,
    );
  }

  async uploadAvatar(avatar: Express.Multer.File, userId: number) {
    if (!avatar.mimetype.includes('image'))
      throw new BadRequestException('incorrect format');
    const avatarName = await this.minioService.uploadFile(
      avatar,
      BucketNames.avatars,
    );
    return await this.userRepository.setAvatar(avatarName, userId);
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

  async getAll(userId: number, page?: number, limit?: number) {
    return await this.userRepository.getAll(userId, page, limit);
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

  async blockUser(userId: number, blockerId: number) {
    return await this.userRepository.block(userId, blockerId);
  }
}
