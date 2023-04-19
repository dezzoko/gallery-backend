import { Controller, Get, Param, Req, Res } from '@nestjs/common';
import { MediaPostService } from './media-post.service';
import { NoAuth } from 'src/common/decorators/no-auth.decorator';
import RequestWithUser from 'src/common/interfaces/request-with-user';

@Controller('media-post')
export class MediaPostController {
  constructor(private readonly mediaPostService: MediaPostService) {}
  @Get('')
  async findAll() {
    return await this.mediaPostService.findAll();
  }

  @Get('self-posts')
  async getSelfPosts(@Req() req: RequestWithUser) {
    return await this.mediaPostService.findSelfPost(req.user.id);
  }

  @Get(':id')
  async getPostById(
    @Param('id') id: string,
    @Req() req: RequestWithUser,
    @Res() res,
  ) {
    if (req.user.id === +id) res.redirect('self-posts');
    return await this.mediaPostService.findByUserId(+id);
  }
}
