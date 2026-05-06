import { IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { BlocklistType } from '@prisma/client';

export class AddBlocklistDto {
  @IsEnum(BlocklistType)
  type!: BlocklistType;

  @IsString()
  @MinLength(2)
  value!: string;

  @IsOptional()
  @IsString()
  reason?: string;
}
