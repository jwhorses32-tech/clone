import {
  ArrayMinSize,
  IsArray,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

export class CreateWebhookEndpointDto {
  @IsUrl({ require_tld: false })
  url!: string;

  @IsOptional()
  @IsArray()
  @ArrayMinSize(0)
  @IsString({ each: true })
  events?: string[];
}
