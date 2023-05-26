import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { MediaPostModule } from '../media-post/media-post.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [MediaPostModule, UserModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
