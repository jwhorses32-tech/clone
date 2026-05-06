import { IsString, Matches } from 'class-validator';

export class ResetPinDto {
  @IsString()
  token!: string;

  @IsString()
  @Matches(/^\d{4,6}$/)
  pin!: string;
}
