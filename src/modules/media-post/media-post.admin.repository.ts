import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { MediaPostEntity } from './entities/media-post.entity';
import { calculatePagination } from 'src/common/utils/calculatePagination';

@Injectable()
export class MediaPostAdminRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll(limit: number, page: number) {
    const { take, skip } = calculatePagination(limit, page);

    const [posts, total] = await Promise.all([
      await this.prismaService.mediaPost.findMany({
        skip,
        take,
        include: {
          creator: true,
        },
      }),
      this.prismaService.mediaPost.count({
        where: {
          isBlocked: false,
        },
      }),
    ]);
    const totalPages = Math.ceil(total / limit);
    if (!posts.length) {
      return [];
    }

    return {
      posts: posts.map((post) => MediaPostEntity.fromObject(post)),
      page,
      limit,
      total,
      totalPages,
    };
  }

  async delete(id: number) {
    try {
      await this.prismaService.mediaPost.delete({
        where: {
          id,
        },
      });
    } catch (error) {
      console.error(error);

      throw new BadRequestException(error);
    }
  }

  async blockPostForUser(id: number, blockedUserId: number) {
    try {
      const blockedPost = await this.prismaService.mediaPost.update({
        where: {
          id,
        },
        data: {
          blockedUsers: {
            connect: { id: blockedUserId },
          },
        },
      });
      return MediaPostEntity.fromObject(blockedPost);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async blockMediaPost(id: number) {
    const candidateToBlockedPost =
      await this.prismaService.mediaPost.findUnique({
        where: {
          id,
        },
      });
    if (!candidateToBlockedPost) throw new NotFoundException();

    const blockedPost = await this.prismaService.mediaPost.update({
      where: {
        id,
      },
      data: {
        isBlocked: !candidateToBlockedPost.isBlocked,
      },
    });
    return MediaPostEntity.fromObject(blockedPost);
  }
}
