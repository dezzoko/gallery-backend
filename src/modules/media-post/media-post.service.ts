import { Inject, Injectable } from '@nestjs/common';
import { CreateMediaPostDto } from './dto/create-media-post.dto';
import { UpdateMediaPostDto } from './dto/update-media-post.dto';
import { MEDIA_POST_REPOSITORY } from 'src/common/constants/tokens';
import { MediaPostRepository } from './media-post.repository';

@Injectable()
export class MediaPostService {
  constructor(
    @Inject(MEDIA_POST_REPOSITORY)
    private readonly mediaPostRepository: MediaPostRepository,
  ) {}

  async findAll() {
    return await this.mediaPostRepository.getAll();
  }
  async findSelfPost(userId: number) {
    return await this.mediaPostRepository.getSelfUserPosts(userId);
  }

  async findByUserId(userId: number) {
    return await this.mediaPostRepository.getByUserId(userId);
  }
}
