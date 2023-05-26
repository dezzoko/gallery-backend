import {
  BadRequestException,
  Injectable,
  StreamableFile,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as uuid from 'uuid';
import * as Minio from 'minio';

export enum BucketNames {
  media = 'media',
  avatars = 'avatars',
}
@Injectable()
export class MinioService {
  private minioClient: Minio.Client;
  public BucketNames: BucketNames;

  constructor(private readonly configService: ConfigService) {
    this.minioClient = new Minio.Client({
      endPoint: this.configService.get('MINIO_ENDPOINT'),
      port: +this.configService.get('MINIO_PORT'),
      useSSL: this.configService.get('MINIO_USE_SSL') === 'true',
      accessKey: this.configService.get('MINIO_ACCESS_KEY'),
      secretKey: this.configService.get('MINIO_SECRET_KEY'),
    });
  }

  async createBucket(): Promise<void> {
    Object.keys(BucketNames).forEach(async (bucketName) => {
      try {
        const bucketExists = await this.minioClient.bucketExists(bucketName);
        if (!bucketExists) {
          await this.minioClient.makeBucket(bucketName, 'us-east-1');
        }
      } catch (error) {
        console.error('cannot create bucket:' + error);
      }
    });
  }

  async uploadFile(file: Express.Multer.File, bucketName: BucketNames) {
    const fileName = file.originalname;
    console.log(file.originalname);
    console.log(file.mimetype);

    await this.minioClient.putObject(
      bucketName,
      fileName,
      file.buffer,
      file.size,
    );
    return fileName;
  }

  async getFile(fileName: string, bucketName: BucketNames) {
    const file = await this.minioClient.getObject(bucketName, fileName);

    return file;
  }

  async getMedia(fileName: string, bucketName: BucketNames) {
    const file = await this.minioClient.getObject(bucketName, fileName);

    return file;
  }

  async deleteFile(fileName: string, bucketName: BucketNames) {
    return await this.minioClient.removeObject(bucketName, fileName);
  }
}
