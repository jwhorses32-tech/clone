import {
  IsInt,
  IsOptional,
  IsString,
  Min,
  MinLength,
  IsUrl,
} from 'class-validator';

export class CreateInvoiceV1Dto {
  @IsInt()
  @Min(1)
  /** Amount in cents (smallest currency unit) */
  amount!: number;

  @IsString()
  @MinLength(2)
  brand_slug!: string;

  @IsString()
  @MinLength(1)
  order_reference!: string;

  @IsOptional()
  @IsUrl({ require_tld: false })
  webhook_url?: string;

  @IsOptional()
  @IsString()
  idempotency_key?: string;
}
