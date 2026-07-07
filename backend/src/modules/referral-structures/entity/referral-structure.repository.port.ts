import { ICrudRepository } from '../../../common/base/base-repository.port';
import { ReferralStructure } from './referral-structure.entity';
import { ReferralStructureType } from './enums/referral-structure-type.enum';

export const REFERRAL_STRUCTURE_REPOSITORY = Symbol('REFERRAL_STRUCTURE_REPOSITORY');

export interface TranslationInput {
  locale: string;
  label: string;
}

export interface ReferralStructureQueryOptions {
  regionId?: string | string[];
  includeInactive?: boolean;
}

export interface UpdateReferralStructureInput {
  type?: ReferralStructureType;
  name?: string;
  regionId?: string;
  contactPhone?: string;
  contactEmail?: string;
  isActive?: boolean;
  // Replace-all: when present, fully replaces the existing translation set.
  translations?: TranslationInput[];
}

export interface IReferralStructureRepository extends ICrudRepository<ReferralStructure> {
  findByRegion(regionId: string): Promise<ReferralStructure[]>;
  findAllFiltered(options: ReferralStructureQueryOptions): Promise<ReferralStructure[]>;
  update(id: string, data: UpdateReferralStructureInput): Promise<ReferralStructure>;
}
