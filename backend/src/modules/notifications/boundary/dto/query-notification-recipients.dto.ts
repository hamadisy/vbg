import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsOptional, IsUUID } from 'class-validator';

export class QueryNotificationRecipientsDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  regionId?: string;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  includeInactive?: boolean;
}
