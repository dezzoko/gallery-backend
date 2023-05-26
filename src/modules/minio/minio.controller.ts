import {
  Controller,
  Get,
  Param,
  Post,
  Req,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { BucketNames, MinioService } from './minio.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { NoJwtAuth } from 'src/common/decorators/no-auth.decorator';
@Controller('minio')
export class MinioController {
  constructor(private readonly minioService: MinioService) {}
  @NoJwtAuth()
  @Post('upload-avatar')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File): Promise<any> {
    return await this.minioService.uploadFile(file, BucketNames.avatars);
  }
  @NoJwtAuth()
  @Post('upload-media')
  @UseInterceptors(FileInterceptor('file'))
  async uploadMedia(@UploadedFile() file: Express.Multer.File): Promise<any> {
    return await this.minioService.uploadFile(file, BucketNames.media);
  }
  @NoJwtAuth()
  @Get('media/:fileName')
  async getMedia(@Param('fileName') fileName: string, @Res() res: Response) {
    const file = await this.minioService.getMedia(fileName, BucketNames.media);
    res.set({
      'Content-Type': 'video/mp4',
    });
    file.pipe(res);
  }
  @NoJwtAuth()
  @Get('avatar/:fileName')
  async getAvatar(@Param('fileName') fileName: string, @Res() res: Response) {
    const file = await this.minioService.getFile(fileName, BucketNames.avatars);
    file.on('data', (chunk) => res.write(chunk));
    file.on('end', () => res.end());
  }
}
