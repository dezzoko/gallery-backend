import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { hashPasword } from 'src/common/utils/bcrypt';
import { UserEntity } from './entities/user.entity';
import { calculatePagination } from 'src/common/utils/calculatePagination';
import { MediaPostEntity } from '../media-post/entities/media-post.entity';
import { RolesEnum } from 'src/common/enums/roles.enum';

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

    return UserEntity.fromObject(user);
  }

  async addRoleToUser(userId: number, roleName: string) {
    const role = await this.prismaService.roles.findUnique({
      where: { roleName: roleName },
    });

    if (role) {
      await this.prismaService.user.update({
        where: { id: userId },
        data: { roles: { connect: { id: role.id } } },
      });
    } else {
      const newRole = await this.prismaService.roles.create({
        data: { roleName: roleName },
      });
      await this.prismaService.user.update({
        where: { id: userId },
        data: { roles: { connect: { id: newRole.id } } },
      });
    }
  }

  async getAll(page?: number, limit?: number) {
    const { take, skip } = calculatePagination(limit, page);

    const [users, total] = await Promise.all([
      await this.prismaService.user.findMany({
        skip,
        take,
        include: {
          roles: {
            select: {
              roleName: true,
            },
          },
        },
      }),
      this.prismaService.user.count(),
    ]);
    const totalPages = Math.ceil(total / limit);
    if (!users.length) {
      return [];
    }

    return {
      users: users.map((user) => UserEntity.fromObject(user)),
      page,
      limit,
      total,
      totalPages,
    };
  }

  async getByEmail(email: string) {
    try {
      return UserEntity.fromObject(
        await this.prismaService.user.findUnique({
          where: {
            email: email,
          },
        }),
      );
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
    const user = await this.prismaService.user.create({
      data: {
        ...createUserDto,
      },
      include: {
        roles: true,
      },
    });

    this.addRoleToUser(user.id, RolesEnum.INTERNAL_USER);
    return UserEntity.fromObject(user);
  }
}
