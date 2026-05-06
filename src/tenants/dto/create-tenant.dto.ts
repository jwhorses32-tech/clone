import { IsString, Matches, MinLength } from 'class-validator';

export class CreateTenantDto {
  @IsString()
  @MinLength(2)
  displayName!: string;

  @IsString()
  @MinLength(2)
  @Matches(/^[a-z0-9-]+$/)
  brandSlug!: string;
}
