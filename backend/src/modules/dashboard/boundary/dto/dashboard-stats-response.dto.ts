import { ApiProperty } from '@nestjs/swagger';

export class RegionCaseCountDto {
  @ApiProperty() regionId: string;
  @ApiProperty() regionName: string;
  @ApiProperty() count: number;
}

export class ViolenceCategoryCaseCountDto {
  @ApiProperty() violenceCategoryId: string;
  @ApiProperty() code: string;
  @ApiProperty() count: number;
}

export class RegionViolenceCategoryCaseCountDto {
  @ApiProperty() regionId: string;
  @ApiProperty() regionName: string;
  @ApiProperty() violenceCategoryId: string;
  @ApiProperty() code: string;
  @ApiProperty() count: number;
}

// Community Relay gets this scoped to their own cases; Regional Director to
// their own region (casesByRegion will just be one row in both cases);
// Institutional User/Administrator get it global.
export class DashboardStatsResponseDto {
  @ApiProperty() totalCases: number;

  @ApiProperty({ type: () => RegionCaseCountDto, isArray: true })
  casesByRegion: RegionCaseCountDto[];

  @ApiProperty({ type: () => ViolenceCategoryCaseCountDto, isArray: true })
  casesByViolenceCategory: ViolenceCategoryCaseCountDto[];

  @ApiProperty({ type: () => RegionViolenceCategoryCaseCountDto, isArray: true })
  casesByRegionAndCategory: RegionViolenceCategoryCaseCountDto[];
}
