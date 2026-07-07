import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateNotificationRecipientDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  phone: string;

  @ApiPropertyOptional({ description: 'Omit for "all regions"' })
  @IsOptional()
  @IsUUID()
  regionId?: string;

  @ApiPropertyOptional({ description: 'Omit for "all violence categories"' })
  @IsOptional()
  @IsUUID()
  violenceCategoryId?: string;
}
