import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDateString, IsOptional, IsString, IsUUID, ValidateNested } from 'class-validator';
import { CreateVictimDto } from './create-victim.dto';

export class CreateCaseDto {
  @ApiProperty()
  @IsUUID()
  regionId: string;

  @ApiProperty()
  @IsUUID()
  violenceCategoryId: string;

  @ApiProperty({ description: 'When the violence occurred (ISO 8601)' })
  @IsDateString()
  incidentAt: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  measuresTaken?: string;

  @ApiProperty()
  @IsUUID()
  referralStructureId: string;

  @ApiProperty({ type: () => CreateVictimDto })
  @ValidateNested()
  @Type(() => CreateVictimDto)
  victim: CreateVictimDto;
}
