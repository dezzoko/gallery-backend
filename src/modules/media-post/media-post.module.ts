import { Module } from '@nestjs/common';
import { MediaPostService } from './media-post.service';
import {
  MEDIA_POST_ADMIN_REPOSITORY,
  MEDIA_POST_REPOSITORY,
} from 'src/common/constants/tokens';
import { MediaPostRepository } from './media-post.repository';
import { MediaPostController } from './media-post.controller';
import { RolesGuard } from 'src/common/guards/role.guard';
import { MinioModule } from '../minio/minio.module';
import { MinioService } from '../minio/minio.service';
import { MediaPostAdminRepository } from './media-post.admin.repository';

@Module({
  imports: [MinioModule],
  controllers: [MediaPostController],
  providers: [
    MediaPostService,
    RolesGuard,
    {
      provide: MEDIA_POST_REPOSITORY,
      useClass: MediaPostRepository,
    },
    {
      provide: MEDIA_POST_ADMIN_REPOSITORY,
      useClass: MediaPostAdminRepository,
    },
  ],
  exports: [MediaPostService],
})
export class MediaPostModule {}
