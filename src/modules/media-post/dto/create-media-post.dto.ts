import { IsString } from 'class-validator';
export class CreateMediaPostDto {
  @IsString()
  title: string;
  @IsString()
  description: string;
}
