import {
  IsEmail,
  IsOptional,
  IsStrongPassword,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Match } from 'src/common/decorators/match.decorator';
export class SignupDto {
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
  // @IsStrongPassword()
  password: string;

  @MinLength(8)
  @MaxLength(30)
  @Match('password')
  confirmPassword: string;
}
