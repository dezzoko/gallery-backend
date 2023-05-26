import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import RequestWithUser from 'src/common/interfaces/request-with-user';
import { PaginationParams } from 'src/common/interfaces/pagination';
import { ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get('self')
  async getSelf(@Req() req: RequestWithUser) {
    return this.userService.getById(req.user.id);
  }
  @Get('')
  async getAll(
    @Query() { page, limit }: PaginationParams,
    @Req() req: RequestWithUser,
  ) {
    console.log(req.user.id);

    return await this.userService.getAll(req.user.id, page, limit);
  }
  @Get(':id')
  async getOne(@Param('id') id: string) {
    return await this.userService.getById(+id);
  }

  @Post('upload-avatar')
  @UseInterceptors(FileInterceptor('avatar'))
  async uploadAvatar(
    @UploadedFile('avatar') avatar: Express.Multer.File,
    @Req() req: RequestWithUser,
  ) {
    return await this.userService.uploadAvatar(avatar, req.user.id);
  }

  @Get('email/:email')
  async getByEmail(@Param('email') email: string) {
    return await this.userService.getByEmail(email);
  }
  @Post('create')
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.userService.createUser(createUserDto);
  }

  @Patch('block-user/:id')
  async blockUser(@Param('id') id: string, @Req() req: RequestWithUser) {
    const userId = parseInt(id, 10);
    if (isNaN(userId)) {
      throw new BadRequestException('Invalid media post ID');
    }
    if (userId === req.user.id) {
      throw new BadRequestException('You are cant to block yourself');
    }
    return await this.userService.blockUser(userId, req.user.id);
  }
}
