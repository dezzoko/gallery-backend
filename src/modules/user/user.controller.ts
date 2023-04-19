import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import RequestWithUser from 'src/common/interfaces/request-with-user';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get('self')
  async getSelf(@Req() req: RequestWithUser) {
    return this.userService.getById(req.user.id);
  }
  @Get('')
  async get() {
    return await this.userService.getAll();
  }
  @Get(':id')
  async getOne(@Param('id') id: string) {
    return await this.userService.getById(+id);
  }

  @Get('email/:email')
  async getByEmail(@Param('email') email: string) {
    return await this.userService.getByEmail(email);
  }
  @Post('create')
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.userService.createUser(createUserDto);
  }
}
