import { Inject, Injectable, Logger } from '@nestjs/common';
import {
  IReferralStructureRepository,
  REFERRAL_STRUCTURE_REPOSITORY,
} from '../../modules/referral-structures/entity/referral-structure.repository.port';
import { ReferralStructureType } from '../../modules/referral-structures/entity/enums/referral-structure-type.enum';

// Placeholder named contacts for the default region - an Admin fills in the
// real per-region contacts later (per spec "Referral Structures" Phase 0 update).
const SEED_STRUCTURES = [
  { type: ReferralStructureType.Police, name: 'Police' },
  { type: ReferralStructureType.Gendarmerie, name: 'Gendarmerie' },
  { type: ReferralStructureType.SocialServices, name: 'MASEF - Regional Representative' },
  { type: ReferralStructureType.HealthCenter, name: 'CSVVDH Regional Social Worker' },
];

@Injectable()
export class ReferralStructureSeeder {
  private readonly logger = new Logger(ReferralStructureSeeder.name);

  constructor(
    @Inject(REFERRAL_STRUCTURE_REPOSITORY)
    private readonly referralStructures: IReferralStructureRepository,
  ) {}

  async run(regionId: string): Promise<void> {
    const existing = await this.referralStructures.findByRegion(regionId);
    if (existing.length > 0) {
      this.logger.log('Referral structures already seeded for default region, skipping');
      return;
    }
    for (const seed of SEED_STRUCTURES) {
      await this.referralStructures.create({ ...seed, regionId });
      this.logger.log(`Created referral structure "${seed.name}"`);
    }
  }
}
