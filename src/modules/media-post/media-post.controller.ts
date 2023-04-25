import { Controller, Get, Param, Req, Res } from '@nestjs/common';
import { MediaPostService } from './media-post.service';
import RequestWithUser from 'src/common/interfaces/request-with-user';
import { Response } from 'express';
import { Roles } from 'src/common/decorators/roles.decorator';
import { EMAIL_CONFIRMED } from 'src/common/constants/roles';
@Controller('media-post')
export class MediaPostController {
  constructor(private readonly mediaPostService: MediaPostService) {}
  @Get('')
  async findAll() {
    return await this.mediaPostService.findAll();
  }
  @Roles(EMAIL_CONFIRMED)
  @Get('self-posts')
  async getSelfPosts(@Req() req: RequestWithUser) {
    return await this.mediaPostService.findSelfPost(req.user.id);
  }

  @Get(':id')
  async getPostById(
    @Param('id') id: string,
    @Req() req: RequestWithUser,
    @Res() res: Response,
  ) {
    if (req.user.id === +id) res.redirect('self-posts');
    return await this.mediaPostService.findByUserId(+id);
  }
}
