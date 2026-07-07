import { DeepPartial } from 'typeorm';
import { ICrudRepository } from '../../../common/base/base-repository.port';
import { Case } from './case.entity';
import { CaseStatus } from './enums/case-status.enum';

export const CASE_REPOSITORY = Symbol('CASE_REPOSITORY');

export interface CaseQueryOptions {
  ownerId?: string; // mandatory restriction: Community Relay's own cases
  scopeRegionId?: string; // mandatory restriction: Regional Director's own region
  filterRegionId?: string; // optional narrowing filter: Admin/Institutional picking one region
  status?: CaseStatus;
  violenceCategoryId?: string;
  search?: string;
}

// Absent regionId/ownerId = global (Institutional User/Administrator);
// regionId = a single region (Regional Director's own region); ownerId =
// a single creator (Community Relay's own cases).
export interface CaseStatsScope {
  regionId?: string;
  ownerId?: string;
}

export interface RegionCaseCount {
  regionId: string;
  regionName: string;
  count: number;
}

export interface ViolenceCategoryCaseCount {
  violenceCategoryId: string;
  code: string;
  count: number;
}

export interface RegionViolenceCategoryCaseCount {
  regionId: string;
  regionName: string;
  violenceCategoryId: string;
  code: string;
  count: number;
}

export interface ICaseRepository extends ICrudRepository<Case> {
  // findById (from ICrudRepository) stays relation-free and cheap - that's what
  // the region/ownership guards call. Full relations are only loaded here.
  findByIdWithRelations(id: string): Promise<Case | null>;
  findAllScoped(options: CaseQueryOptions): Promise<Case[]>;
  update(id: string, data: DeepPartial<Case>): Promise<Case>;

  countTotal(scope: CaseStatsScope): Promise<number>;
  // Unscoped, global count of non-Closed cases - backs the public open-cases badge.
  countOpen(): Promise<number>;
  countByRegion(scope: CaseStatsScope): Promise<RegionCaseCount[]>;
  countByViolenceCategory(scope: CaseStatsScope): Promise<ViolenceCategoryCaseCount[]>;
  countByRegionAndCategory(scope: CaseStatsScope): Promise<RegionViolenceCategoryCaseCount[]>;
}
