import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { hashPasword } from 'src/common/utils/bcrypt';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UserRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async getById(id: number) {
    const user = await this.prismaService.user.findUnique({
      where: {
        id: id,
      },
      include: {
        roles: true,
      },
    });
    console.log(user.roles);

    return UserEntity.fromObject(user);
  }
  async getAll() {
    const users = await this.prismaService.user.findMany({
      include: {
        roles: {
          select: {
            roleName: true,
          },
        },
      },
    });
    const userEntities = users.map((user) => UserEntity.fromObject(user));
    console.log(userEntities);

    return userEntities;
  }

  async getByEmail(email: string) {
    try {
      return await this.prismaService.user.findUnique({
        where: {
          email: email,
        },
      });
    } catch (error) {
      throw new BadRequestException('There is no such user');
    }
  }
  async setCurrentRefreshToken(refreshToken: string, userId: number) {
    const currentHashedRefreshToken = await hashPasword(refreshToken);

    await this.prismaService.user.update({
      where: { id: userId },
      data: { currentHashedRefreshToken },
    });
  }

  async create(createUserDto: CreateUserDto) {
    const internalRole = await this.prismaService.roles.findUnique({
      where: {
        roleName: 'INTERNAL_USER',
      },
    });
    const user = await this.prismaService.user.create({
      data: {
        ...createUserDto,
        roles: {
          connect: {
            id: internalRole.id,
          },
        },
      },
      include: {
        roles: true,
      },
    });

    return UserEntity.fromObject(user);
  }
}
