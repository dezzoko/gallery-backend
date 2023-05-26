import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import {
  MEDIA_POST_ADMIN_REPOSITORY,
  MEDIA_POST_REPOSITORY,
} from 'src/common/constants/tokens';
import { MediaPostRepository } from './media-post.repository';
import { CreateMediaPostDto } from './dto/create-media-post.dto';
import { BucketNames, MinioService } from '../minio/minio.service';
import { MediaPostAdminRepository } from './media-post.admin.repository';

@Injectable()
export class MediaPostService {
  constructor(
    private readonly minioService: MinioService,
    @Inject(MEDIA_POST_REPOSITORY)
    private readonly mediaPostRepository: MediaPostRepository,
    @Inject(MEDIA_POST_ADMIN_REPOSITORY)
    private readonly mediaPostAdminRepository: MediaPostAdminRepository,
  ) {}

  async findAll(userId: number, page?: number, limit?: number) {
    return await this.mediaPostRepository.getAll(userId, page, limit);
  }

  async createMediaPost(
    mediaPost: CreateMediaPostDto,
    file: Express.Multer.File,
    userId: number,
  ) {
    if (!file.mimetype.includes('mp4'))
      throw new BadRequestException('incorrect format');
    const fileName = await this.minioService.uploadFile(
      file,
      BucketNames.media,
    );
    return await this.mediaPostRepository.create(mediaPost, fileName, userId);
  }

  async deletePost(mediaPostId: number, userId: number) {
    return await this.mediaPostRepository.delete(mediaPostId, userId);
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

  async getAllAdmin(limit?: number, page?: number) {
    return this.mediaPostAdminRepository.findAll(limit, page);
  }

  async blockPostForUserAdmin(mediaPostId: number, blockedUserId: number) {
    return await this.mediaPostAdminRepository.blockPostForUser(
      mediaPostId,
      blockedUserId,
    );
  }

  async blockMediaPostAdmin(mediaPostId: number) {
    return await this.mediaPostAdminRepository.blockMediaPost(mediaPostId);
  }

  async deleteMediaPostAdmin(mediaPostId: number) {
    return await this.mediaPostAdminRepository.delete(mediaPostId);
  }
}
