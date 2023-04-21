import { Module } from '@nestjs/common';
import { MediaPostService } from './media-post.service';
import { MEDIA_POST_REPOSITORY } from 'src/common/constants/tokens';
import { MediaPostRepository } from './media-post.repository';
import { MediaPostController } from './media-post.controller';
import { RolesGuard } from 'src/common/guards/role.guard';

@Module({
  controllers: [MediaPostController],
  providers: [
    MediaPostService,
    RolesGuard,
    {
      provide: MEDIA_POST_REPOSITORY,
      useClass: MediaPostRepository,
    },
  ],
  exports: [MediaPostService],
})
export class MediaPostModule {}
