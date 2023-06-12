import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { hashPassword } from 'src/common/utils/bcrypt';
import { UserEntity } from './entities/user.entity';
import { calculatePagination } from 'src/common/utils/calculatePagination';
import { RolesEnum } from 'src/common/enums/roles.enum';

@Injectable()
export class UserRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async getById(id: number) {
    console.log(id, 'ID UNIQUE BLA BLA');

    const user = await this.prismaService.user.findUnique({
      where: {
        id: id,
      },
      include: {
        roles: true,
        blocker: {
          select: {
            blockedUser: true,
          },
        },
      },
    });
    const userEntity = {
      ...user,
      blockedUsers: user.blocker.map((blockedUser) => blockedUser.blockedUser),
    };
    delete userEntity.blocker;

    return UserEntity.fromObject(userEntity);
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

  async getAll(userId: number, page?: number, limit?: number) {
    const { take, skip } = calculatePagination(limit, page);
    const [users, total] = await Promise.all([
      await this.prismaService.user.findMany({
        where: {
          NOT: {
            blocker: {
              some: {
                blockedId: userId,
              },
            },
          },
        },
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
      this.prismaService.user.count({
        where: {
          NOT: {
            blocker: {
              some: {
                blockedId: userId,
              },
            },
          },
        },
      }),
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
    const currentHashedRefreshToken = await hashPassword(refreshToken);

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

  async block(id: number, blockerId: number) {
    const user = await this.prismaService.user.findUnique({
      where: { id },
    });

    if (!user) throw new NotFoundException('There is no user with such id');
    await this.prismaService.blockedUsers.create({
      data: {
        blockedId: id,
        blockerId: blockerId,
      },
    });
  }

  async setAvatar(avatarName: string, id: number) {
    await this.prismaService.user.update({
      where: {
        id,
      },
      data: {
        avatar: avatarName,
      },
    });
  }
}
