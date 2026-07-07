import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDateString, IsOptional, IsString, IsUUID, ValidateNested } from 'class-validator';
import { UpdateVictimDto } from './update-victim.dto';

// regionId is intentionally not editable here - a case's reported location
// doesn't move after the fact; only content/situation fields can be corrected.
export class UpdateCaseDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  violenceCategoryId?: string;

  @ApiPropertyOptional({ description: 'When the violence occurred (ISO 8601)' })
  @IsOptional()
  @IsDateString()
  incidentAt?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  measuresTaken?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  referralStructureId?: string;

  @ApiPropertyOptional({ type: () => UpdateVictimDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateVictimDto)
  victim?: UpdateVictimDto;
}
