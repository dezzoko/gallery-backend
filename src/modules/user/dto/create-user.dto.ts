import { IsEmail, IsOptional, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
  @MinLength(3)
  @MaxLength(30)
  name: string;

  @MinLength(3)
  @MaxLength(30)
  @IsOptional()
  surname: string;

  @IsEmail()
  @MinLength(5)
  @MaxLength(30)
  email: string;

  @MinLength(8)
  @MaxLength(30)
  password: string;
}
