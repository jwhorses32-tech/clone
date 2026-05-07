import { IsObject, IsString, MinLength } from 'class-validator';

export class ConnectGatewayDto {
  @IsString()
  @MinLength(2)
  gatewayCode!: string;

  @IsObject()
  credentials!: Record<string, unknown>;
}
