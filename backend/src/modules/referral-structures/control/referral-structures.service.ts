import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  IReferralStructureRepository,
  REFERRAL_STRUCTURE_REPOSITORY,
  ReferralStructureQueryOptions,
} from '../entity/referral-structure.repository.port';
import { ReferralStructure } from '../entity/referral-structure.entity';
import { IRegionRepository, REGION_REPOSITORY } from '../../regions/entity/region.repository.port';
import { CreateReferralStructureDto } from '../boundary/dto/create-referral-structure.dto';
import { UpdateReferralStructureDto } from '../boundary/dto/update-referral-structure.dto';
import { QueryReferralStructuresDto } from '../boundary/dto/query-referral-structures.dto';

@Injectable()
export class ReferralStructuresService {
  constructor(
    @Inject(REFERRAL_STRUCTURE_REPOSITORY)
    private readonly referralStructures: IReferralStructureRepository,
    @Inject(REGION_REPOSITORY)
    private readonly regions: IRegionRepository,
  ) {}

  create(dto: CreateReferralStructureDto): Promise<ReferralStructure> {
    return this.referralStructures.create(dto);
  }

  async findAll(query: QueryReferralStructuresDto): Promise<ReferralStructure[]> {
    // Referral structures are master data "per region" (spec), but regionId
    // here is a specific commune row - resolve every commune sharing that
    // region's name so any commune under e.g. "Nouakchott" sees the same set.
    let regionId: string | string[] | undefined = query.regionId;
    if (query.regionId) {
      const region = await this.regions.findById(query.regionId);
      if (region) {
        const siblings = await this.regions.findAllFiltered(false);
        regionId = siblings.filter((r) => r.name === region.name).map((r) => r.id);
      }
    }

    const options: ReferralStructureQueryOptions = {
      regionId,
      includeInactive: query.includeInactive ?? false,
    };
    return this.referralStructures.findAllFiltered(options);
  }

  async findById(id: string): Promise<ReferralStructure> {
    const referralStructure = await this.referralStructures.findById(id);
    if (!referralStructure) {
      throw new NotFoundException('Referral structure not found');
    }
    return referralStructure;
  }

  async update(id: string, dto: UpdateReferralStructureDto): Promise<ReferralStructure> {
    await this.findById(id);
    return this.referralStructures.update(id, dto);
  }

  async deactivate(id: string): Promise<void> {
    await this.findById(id);
    await this.referralStructures.update(id, { isActive: false });
  }
}
