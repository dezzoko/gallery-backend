import { Inject, Injectable } from '@nestjs/common';
import { MEDIA_POST_REPOSITORY } from 'src/common/constants/tokens';
import { MediaPostRepository } from './media-post.repository';

@Injectable()
export class MediaPostService {
  constructor(
    @Inject(MEDIA_POST_REPOSITORY)
    private readonly mediaPostRepository: MediaPostRepository,
  ) {}

  async findAll(page?: number, limit?: number) {
    return await this.mediaPostRepository.getAll(page, limit);
  }
  async findSelfPost(userId: number, page?: number, limit?: number) {
    return await this.mediaPostRepository.getSelfUserPosts(userId, page, limit);
  }

  async findByUserId(userId: number) {
    return await this.mediaPostRepository.getByUserId(userId);
  }

  async blockMediaPost(mediaPostId: number, userId: number) {
    return await this.mediaPostRepository.blockMediaPost(mediaPostId, userId);
  }

  async blockPostForUser(
    mediaPostId: number,
    blockedUserId: number,
    creatorId: number,
  ) {
    return await this.mediaPostRepository.blockPostForUser(
      mediaPostId,
      blockedUserId,
      creatorId,
    );
  }
}
