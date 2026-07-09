import { Inject, Injectable, Logger } from '@nestjs/common';
import {
  IReferralStructureRepository,
  REFERRAL_STRUCTURE_REPOSITORY,
  TranslationInput,
} from '../../modules/referral-structures/entity/referral-structure.repository.port';
import { ReferralStructureType } from '../../modules/referral-structures/entity/enums/referral-structure-type.enum';
import { Region } from '../../modules/regions/entity/region.entity';

interface SeedStructure {
  type: ReferralStructureType;
  name: string;
  contactPhone?: string;
  contactEmail?: string;
  isActive?: boolean;
  translations?: TranslationInput[];
}

// Applied to every representative region (per spec "Referral Structures" Phase 0 update).
const BASE_STRUCTURES: SeedStructure[] = [
  { type: ReferralStructureType.Police, name: 'Police' },
  { type: ReferralStructureType.Gendarmerie, name: 'Gendarmerie' },
  { type: ReferralStructureType.SocialServices, name: 'MASEF - Regional Representative' },
  { type: ReferralStructureType.HealthCenter, name: 'CSVVDH Regional Social Worker' },
];

// Extra structures added by an Admin for a specific region+commune, keyed as
// "region name|municipality". Reproduced here so a DB reset restores them.
const REGION_SPECIFIC_STRUCTURES: Record<string, SeedStructure[]> = {
  'Nouakchott|Nord': [
    { type: ReferralStructureType.Police, name: 'Nouadhibou Police' },
    {
      type: ReferralStructureType.Police,
      name: 'Structure Test',
      translations: [{ locale: 'fr', label: 'Structure de test' }],
    },
    {
      type: ReferralStructureType.HealthCenter,
      name: 'Test Health Center',
      contactPhone: '+22200000000',
      isActive: false,
      translations: [
        { locale: 'fr', label: 'Centre de sante modifie' },
        { locale: 'en', label: 'Health center' },
      ],
    },
  ],
};

@Injectable()
export class ReferralStructureSeeder {
  private readonly logger = new Logger(ReferralStructureSeeder.name);

  constructor(
    @Inject(REFERRAL_STRUCTURE_REPOSITORY)
    private readonly referralStructures: IReferralStructureRepository,
  ) {}

  async run(region: Region): Promise<void> {
    const seeds = [
      ...BASE_STRUCTURES,
      ...(REGION_SPECIFIC_STRUCTURES[`${region.name}|${region.municipality}`] ?? []),
    ];

    // Includes inactive rows (findByRegion is unfiltered) so an already-seeded
    // deactivated entry like "Test Health Center" isn't recreated on every run.
    const existing = await this.referralStructures.findByRegion(region.id);
    const existingNames = new Set(existing.map((s) => s.name));

    for (const seed of seeds) {
      if (existingNames.has(seed.name)) {
        continue;
      }
      await this.referralStructures.create({ ...seed, regionId: region.id });
      this.logger.log(
        `Created referral structure "${seed.name}" for ${region.name} - ${region.municipality}`,
      );
    }
  }
}
