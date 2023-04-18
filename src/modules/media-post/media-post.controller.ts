import { Controller, Get } from '@nestjs/common';
import { MediaPostService } from './media-post.service';
import { NoAuth } from 'src/common/decorators/no-auth.decorator';

@Controller('media-post')
export class MediaPostController {
  constructor(private readonly mediaPostService: MediaPostService) {}
  @Get('')
  async findAll() {
    return await this.mediaPostService.findAll();
  }
}
