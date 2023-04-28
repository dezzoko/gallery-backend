import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { MediaPostEntity } from './entities/media-post.entity';
import { calculatePagination } from 'src/common/utils/calculatePagination';
import { log } from 'console';

@Injectable()
export class MediaPostRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async getAll(page?: number, limit?: number) {
    const { take, skip } = calculatePagination(limit, page);

    const [posts, total] = await Promise.all([
      await this.prismaService.mediaPost.findMany({
        skip,
        take,
        where: {
          isBlocked: false,
        },
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

  async getSelfUserPosts(userId: number, page?: number, limit?: number) {
    const { take, skip } = calculatePagination(limit, page);

    const [posts, total] = await Promise.all([
      await this.prismaService.mediaPost.findMany({
        skip,
        take,
        where: {
          creatorId: userId,
        },
        include: {
          creator: true,
        },
      }),
      this.prismaService.mediaPost.count({
        where: {
          creatorId: userId,
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
  async getByUserId(userId: number) {
    const posts = await this.prismaService.mediaPost.findMany({
      where: {
        creatorId: userId,
        isBlocked: false,
      },
    });

    return posts.map((post) => MediaPostEntity.fromObject(post));
  }
  async blockMediaPost(id: number, userId: number) {
    const canditateToBlockedPost =
      await this.prismaService.mediaPost.findUnique({
        where: {
          id,
        },
      });

    if (canditateToBlockedPost.creatorId !== userId)
      throw new BadRequestException(`You aren't the creator`);
    const blockedPost = await this.prismaService.mediaPost.update({
      where: {
        id,
      },
      data: {
        isBlocked: !canditateToBlockedPost.isBlocked,
      },
    });
    return MediaPostEntity.fromObject(blockedPost);
  }

  async blockPostForUser(id: number, blockedUserId: number, creatorId: number) {
    const canditateToBlockedPost =
      await this.prismaService.mediaPost.findUnique({
        where: {
          id,
        },
      });
    if (canditateToBlockedPost.creatorId !== creatorId)
      throw new BadRequestException(`You aren't the creator`);
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
  }
}
