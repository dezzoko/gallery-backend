import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';
//TODO: delete isOptional and add Minio
export class CreateMediaPostDto {
  @IsString()
  title: string;
  @IsOptional()
  contentUrl: string;
  @IsString()
  description: string;
}
