import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateRegionDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  municipality: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  village?: string;
}
