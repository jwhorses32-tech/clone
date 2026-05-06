import { IsEnum, IsString, MinLength } from 'class-validator';
import { BlocklistType } from '@prisma/client';

export class GdprDeleteBlocklistDto {
  @IsEnum(BlocklistType)
  type!: BlocklistType;

  @IsString()
  @MinLength(2)
  value!: string;
}
