import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { CaseStatus } from '../../entity/enums/case-status.enum';

export class QueryCasesDto {
  @ApiPropertyOptional({ enum: CaseStatus })
  @IsOptional()
  @IsEnum(CaseStatus)
  status?: CaseStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  violenceCategoryId?: string;

  @ApiPropertyOptional({ description: 'Only applied for Admin/Institutional User roles' })
  @IsOptional()
  @IsUUID()
  regionId?: string;

  @ApiPropertyOptional({ description: 'Free-text match against case description' })
  @IsOptional()
  @IsString()
  search?: string;
}
