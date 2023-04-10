import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { MediaPostModule } from './modules/media-post/media-post.module';

@Module({
  imports: [PrismaModule, MediaPostModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
