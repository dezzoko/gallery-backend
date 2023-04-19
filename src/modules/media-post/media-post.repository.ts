import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { MediaPostEntity } from './entities/media-post.entity';

@Injectable()
export class MediaPostRepository {
  constructor(private readonly prismaServise: PrismaService) {}

  async getAll() {
    const posts = await this.prismaServise.mediaPost.findMany({
      where: {
        isBlocked: false,
      },
      include: {
        creator: true,
      },
    });
    if (!posts.length) {
      return [];
    }

    return posts.map((post) => MediaPostEntity.fromObject(post));
  }

  async getSelfUserPosts(userId: number) {
    const posts = await this.prismaServise.mediaPost.findMany({
      where: {
        creatorId: userId,
      },
    });

    return posts.map((post) => MediaPostEntity.fromObject(post));
  }
  async getByUserId(userId: number) {
    const posts = await this.prismaServise.mediaPost.findMany({
      where: {
        creatorId: userId,
        isBlocked: false,
      },
    });

    return posts.map((post) => MediaPostEntity.fromObject(post));
  }
}
