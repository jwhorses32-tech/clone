import { IsEmail, IsString, MinLength, Matches } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8)
  password!: string;

  /** 4–6 digit PIN for secondary auth (Polapine-style) */
  @IsString()
  @Matches(/^\d{4,6}$/)
  pin!: string;

  @IsString()
  @MinLength(2)
  displayName!: string;
}
