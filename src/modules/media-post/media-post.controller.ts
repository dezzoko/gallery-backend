import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { MediaPostService } from './media-post.service';
import RequestWithUser from 'src/common/interfaces/request-with-user';
import { Response } from 'express';
import { Roles } from 'src/common/decorators/roles.decorator';
import { EMAIL_CONFIRMED } from 'src/common/constants/roles';
import { PaginationParams } from 'src/common/interfaces/pagination';
@Controller('media-post')
export class MediaPostController {
  constructor(private readonly mediaPostService: MediaPostService) {}
  @Get('')
  async getAll(@Query() { page, limit }: PaginationParams) {
    return await this.mediaPostService.findAll(page, limit);
  }

  @Roles(EMAIL_CONFIRMED)
  @Get('self-posts')
  async getSelfPosts(
    @Req() req: RequestWithUser,
    @Query() { page, limit }: PaginationParams,
  ) {
    return await this.mediaPostService.findSelfPost(req.user.id, page, limit);
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

  @Patch('block/:id')
  async blockMediaPost(@Param('id') id: string, @Req() req: RequestWithUser) {
    return await this.mediaPostService.blockMediaPost(+id, req.user.id);
  }
  @Patch(':id/block/:user-id')
  async blockPostForUser(
    @Param('id') mediaPostId: string,
    @Param('user-id') userId: string,
    @Req() req: RequestWithUser,
  ) {
    const mediaPostIdNum = parseInt(mediaPostId, 10);
    if (isNaN(mediaPostIdNum)) {
      throw new BadRequestException('Invalid media post ID');
    }

    const userIdNum = parseInt(userId, 10);
    if (isNaN(userIdNum)) {
      throw new BadRequestException('Invalid user ID');
    }

    return await this.mediaPostService.blockPostForUser(
      mediaPostIdNum,
      userIdNum,
      req.user.id,
    );
  }
}
