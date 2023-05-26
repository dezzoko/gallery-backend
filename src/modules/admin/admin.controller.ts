import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { ApiTags } from '@nestjs/swagger';
import { PaginationParams } from 'src/common/interfaces/pagination';
@ApiTags('Admin')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('posts')
  async getAll(@Query() { page, limit }: PaginationParams) {
    return await this.adminService.findAllPosts(page, limit);
  }

  @Patch('posts/block/:id')
  async blockPost(@Param('id') id: string) {
    return this.adminService.blockPost(+id);
  }

  @Patch('posts/blockUser/:postId/:userId')
  async blockPostForUser(
    @Param('postId') postId: string,
    @Param('userId') userId: string,
  ) {
    return await this.adminService.blockPostForUser(+postId, +userId);
  }

  @Delete('posts/:mediaPostId')
  async deleteMediaPostById(@Param('mediaPostId') mediaPostId: string) {
    const mediaPostIdNum = parseInt(mediaPostId);
    if (isNaN(mediaPostIdNum))
      throw new BadRequestException('Invalid mediaPost ID');
    return await this.adminService.deletePost(mediaPostIdNum);
  }

  @Patch('user/block/:id')
  async blockUser(
    @Param('userId') userId: string,
    @Param('blockerId') blockerId: string,
  ) {
    return await this.adminService.blockUser(+userId, +blockerId);
  }
}
