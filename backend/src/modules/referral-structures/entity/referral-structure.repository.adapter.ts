import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, In, Repository } from 'typeorm';
import { ReferralStructure } from './referral-structure.entity';
import { ReferralStructureTranslation } from './referral-structure-translation.entity';
import { TypeOrmBaseRepository } from '../../../common/base/base-typeorm.repository';
import {
  IReferralStructureRepository,
  ReferralStructureQueryOptions,
  UpdateReferralStructureInput,
} from './referral-structure.repository.port';

// Only file in this module allowed to import from 'typeorm'.
@Injectable()
export class ReferralStructureTypeOrmRepository
  extends TypeOrmBaseRepository<ReferralStructure>
  implements IReferralStructureRepository
{
  constructor(@InjectRepository(ReferralStructure) repo: Repository<ReferralStructure>) {
    super(repo);
  }

  // Overrides the base (relation-free) findById - no guard depends on this
  // token, and master data is small enough to always eager-load translations.
  findById(id: string): Promise<ReferralStructure | null> {
    return this.repo.findOne({ where: { id }, relations: { translations: true } });
  }

  findByRegion(regionId: string): Promise<ReferralStructure[]> {
    return this.repo.find({ where: { regionId }, relations: { translations: true } });
  }

  findAllFiltered(options: ReferralStructureQueryOptions): Promise<ReferralStructure[]> {
    const where: FindOptionsWhere<ReferralStructure> = {};
    if (options.regionId) {
      where.regionId = Array.isArray(options.regionId) ? In(options.regionId) : options.regionId;
    }
    if (!options.includeInactive) where.isActive = true;

    return this.repo.find({ where, relations: { translations: true } });
  }

  async update(id: string, data: UpdateReferralStructureInput): Promise<ReferralStructure> {
    const existing = await this.repo.findOneBy({ id });
    if (!existing) {
      throw new NotFoundException('Referral structure not found');
    }
    if (data.type !== undefined) existing.type = data.type;
    if (data.name !== undefined) existing.name = data.name;
    if (data.regionId !== undefined) existing.regionId = data.regionId;
    if (data.contactPhone !== undefined) existing.contactPhone = data.contactPhone;
    if (data.contactEmail !== undefined) existing.contactEmail = data.contactEmail;
    if (data.isActive !== undefined) existing.isActive = data.isActive;

    await this.repo.manager.transaction(async (manager) => {
      await manager.save(ReferralStructure, existing);
      if (data.translations) {
        // Delete-then-insert (not a same-save cascade replace): assigning a
        // fresh array via orphanedRowAction can INSERT the new rows before
        // DELETEing the old ones in the same persist, tripping the
        // (referralStructureId, locale) unique constraint when a locale repeats.
        await manager.delete(ReferralStructureTranslation, { referralStructureId: id });
        await manager.save(
          ReferralStructureTranslation,
          data.translations.map((t) =>
            manager.create(ReferralStructureTranslation, {
              referralStructureId: id,
              locale: t.locale,
              label: t.label,
            }),
          ),
        );
      }
    });

    const updated = await this.findById(id);
    if (!updated) {
      throw new Error(`Referral structure ${id} not found after update`);
    }
    return updated;
  }
}
