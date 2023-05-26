import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { MediaPostEntity } from './entities/media-post.entity';
import { calculatePagination } from 'src/common/utils/calculatePagination';
import { CreateMediaPostDto } from './dto/create-media-post.dto';
import { use } from 'passport';

@Injectable()
export class MediaPostRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async getAll(userId: number, page?: number, limit?: number) {
    const { take, skip } = calculatePagination(limit, page);
    const [posts, total] = await Promise.all([
      await this.prismaService.mediaPost.findMany({
        skip,
        take,
        where: {
          isBlocked: false,
          blockedUsers: {
            none: {
              id: userId,
            },
          },
        },

        include: {
          creator: true,
        },
      }),
      this.prismaService.mediaPost.count({
        where: {
          isBlocked: false,
          blockedUsers: {
            none: {
              id: userId,
            },
          },
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

  async create(mediaPost: CreateMediaPostDto, file: string, userId: number) {
    const createdMediaPost = await this.prismaService.mediaPost.create({
      data: {
        ...mediaPost,
        contentUrl: file,
        creator: {
          connect: {
            id: userId,
          },
        },
      },
      include: {
        creator: true,
      },
    });
    console.log(createdMediaPost);

    return MediaPostEntity.fromObject(createdMediaPost);
  }

  async delete(id: number, userId: number) {
    const mediaPost = await this.prismaService.mediaPost.findUnique({
      where: {
        id: id,
      },
    });
    if (mediaPost.creatorId !== userId) throw new ForbiddenException();
    await this.prismaService.mediaPost.delete({
      where: {
        id: id,
      },
    });
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
    const candidateToBlockedPost =
      await this.prismaService.mediaPost.findUnique({
        where: {
          id,
        },
      });

    if (candidateToBlockedPost.creatorId !== userId)
      throw new BadRequestException(`You aren't the creator`);
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

  async blockPostForUser(id: number, blockedUserId: number, creatorId: number) {
    const candidateToBlockedPost =
      await this.prismaService.mediaPost.findUnique({
        where: {
          id,
        },
      });

    console.log(candidateToBlockedPost);

    if (candidateToBlockedPost.creatorId === creatorId) {
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
    throw new BadRequestException(`You aren't the creator`);
  }
}
