import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';

export class QueryAuditLogDto {
  @ApiPropertyOptional({ description: "e.g. 'Case'" })
  @IsOptional()
  @IsString()
  entityType?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  entityId?: string;

  @ApiPropertyOptional({ description: 'Filter by who performed the action' })
  @IsOptional()
  @IsUUID()
  userId?: string;
}
