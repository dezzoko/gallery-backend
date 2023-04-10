import { Controller, Get } from '@nestjs/common';
import { MediaPostService } from './media-post.service';

@Controller('')
export class MediaPostController {
  constructor(private readonly mediaPostService: MediaPostService) {}

  @Get('')
  async findAll() {
    return await this.mediaPostService.findAll();
  }
}
