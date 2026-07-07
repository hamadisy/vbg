import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { AgeRange } from '../../entity/enums/age-range.enum';
import { Sex } from '../../entity/enums/sex.enum';
import { RelationshipToPerpetrator } from '../../entity/enums/relationship-to-perpetrator.enum';
import { VulnerabilityFactor } from '../../entity/enums/vulnerability-factor.enum';
import { SafetyRisk } from '../../entity/enums/safety-risk.enum';

export class CreateVictimDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  alias?: string;

  @ApiProperty({ enum: AgeRange })
  @IsEnum(AgeRange)
  ageRange: AgeRange;

  @ApiProperty({ enum: Sex })
  @IsEnum(Sex)
  sex: Sex;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  contactPhone?: string;

  @ApiProperty({ enum: RelationshipToPerpetrator })
  @IsEnum(RelationshipToPerpetrator)
  relationshipToPerpetrator: RelationshipToPerpetrator;

  @ApiProperty()
  @IsBoolean()
  perpetratorKnown: boolean;

  @ApiProperty()
  @IsBoolean()
  cohabitingWithPerpetrator: boolean;

  @ApiPropertyOptional({ enum: VulnerabilityFactor, isArray: true })
  @IsOptional()
  @IsArray()
  @IsEnum(VulnerabilityFactor, { each: true })
  vulnerabilityFactors?: VulnerabilityFactor[];

  @ApiProperty({ enum: SafetyRisk })
  @IsEnum(SafetyRisk)
  safetyRisk: SafetyRisk;
}
