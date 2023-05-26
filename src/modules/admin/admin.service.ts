import { Injectable } from '@nestjs/common';
import { MediaPostService } from '../media-post/media-post.service';
import { UserService } from '../user/user.service';

@Injectable()
export class AdminService {
  constructor(
    private readonly mediaPostService: MediaPostService,
    private readonly userService: UserService,
  ) {}

  async findAllPosts(limit?: number, page?: number) {
    return await this.mediaPostService.getAllAdmin(limit, page);
  }
  async blockPost(id: number) {
    return await this.mediaPostService.blockMediaPostAdmin(id);
  }
  async blockPostForUser(id: number, userId: number) {
    return await this.mediaPostService.blockPostForUserAdmin(id, userId);
  }

  async deletePost(id: number) {
    return await this.mediaPostService.deleteMediaPostAdmin(id);
  }

  async blockUser(userId: number, blockerId: number) {
    return await this.userService.blockUser(userId, blockerId);
  }
}
