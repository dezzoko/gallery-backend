import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MediaPostRepository {
  constructor(private readonly prismaServise: PrismaService) {}
  async getAll() {
    return await this.prismaServise.user.findMany();
  }
}
