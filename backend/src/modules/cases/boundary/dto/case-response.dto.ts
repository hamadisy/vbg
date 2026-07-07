import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { CaseStatus } from '../../entity/enums/case-status.enum';
import { AgeRange } from '../../entity/enums/age-range.enum';
import { Sex } from '../../entity/enums/sex.enum';
import { RelationshipToPerpetrator } from '../../entity/enums/relationship-to-perpetrator.enum';
import { SafetyRisk } from '../../entity/enums/safety-risk.enum';
import { FollowUpOutcome } from '../../entity/enums/follow-up-outcome.enum';

// Explicit allow-list mapping, same pattern as UserResponseDto - createdBy/author
// must never leak passwordHash.
export class CaseUserSummaryDto {
  @ApiProperty() @Expose() id: string;
  @ApiProperty() @Expose() fullName: string;
  @ApiProperty() @Expose() username: string;
}

export class RegionSummaryDto {
  @ApiProperty() @Expose() id: string;
  @ApiProperty() @Expose() name: string;
  @ApiProperty() @Expose() municipality: string;
  @ApiPropertyOptional() @Expose() village?: string;
}

export class ViolenceCategorySummaryDto {
  @ApiProperty() @Expose() id: string;
  @ApiProperty() @Expose() code: string;
}

export class ReferralStructureSummaryDto {
  @ApiProperty() @Expose() id: string;
  @ApiProperty() @Expose() type: string;
  @ApiProperty() @Expose() name: string;
}

export class VictimResponseDto {
  @ApiProperty() @Expose() id: string;
  @ApiPropertyOptional() @Expose() alias?: string;
  @ApiProperty({ enum: AgeRange }) @Expose() ageRange: AgeRange;
  @ApiProperty({ enum: Sex }) @Expose() sex: Sex;
  @ApiPropertyOptional() @Expose() contactPhone?: string;
  @ApiProperty({ enum: RelationshipToPerpetrator })
  @Expose()
  relationshipToPerpetrator: RelationshipToPerpetrator;
  @ApiProperty() @Expose() perpetratorKnown: boolean;
  @ApiProperty() @Expose() cohabitingWithPerpetrator: boolean;
  @ApiPropertyOptional({ type: [String] }) @Expose() vulnerabilityFactors?: string[];
  @ApiProperty({ enum: SafetyRisk }) @Expose() safetyRisk: SafetyRisk;
}

export class FollowUpEntryResponseDto {
  @ApiProperty() @Expose() id: string;

  @ApiProperty({ type: () => CaseUserSummaryDto })
  @Expose()
  @Type(() => CaseUserSummaryDto)
  author: CaseUserSummaryDto;

  @ApiProperty() @Expose() comment: string;
  @ApiProperty({ enum: FollowUpOutcome }) @Expose() outcome: FollowUpOutcome;
  @ApiProperty() @Expose() createdAt: Date;
}

export class CaseResponseDto {
  @ApiProperty() @Expose() id: string;

  @ApiProperty({ type: () => CaseUserSummaryDto })
  @Expose()
  @Type(() => CaseUserSummaryDto)
  createdBy: CaseUserSummaryDto;

  @ApiProperty({ type: () => RegionSummaryDto })
  @Expose()
  @Type(() => RegionSummaryDto)
  region: RegionSummaryDto;

  @ApiProperty({ type: () => ViolenceCategorySummaryDto })
  @Expose()
  @Type(() => ViolenceCategorySummaryDto)
  violenceCategory: ViolenceCategorySummaryDto;

  @ApiPropertyOptional() @Expose() incidentAt?: Date | null;

  @ApiProperty() @Expose() description: string;

  @ApiProperty({ type: () => VictimResponseDto })
  @Expose()
  @Type(() => VictimResponseDto)
  victim: VictimResponseDto;

  @ApiPropertyOptional() @Expose() measuresTaken?: string;

  @ApiProperty({ type: () => ReferralStructureSummaryDto })
  @Expose()
  @Type(() => ReferralStructureSummaryDto)
  referralStructure: ReferralStructureSummaryDto;

  @ApiProperty({ enum: CaseStatus }) @Expose() status: CaseStatus;

  @ApiProperty({ type: () => FollowUpEntryResponseDto, isArray: true })
  @Expose()
  @Type(() => FollowUpEntryResponseDto)
  followUpEntries: FollowUpEntryResponseDto[];

  @ApiProperty() @Expose() createdAt: Date;
  @ApiProperty() @Expose() updatedAt: Date;
}
