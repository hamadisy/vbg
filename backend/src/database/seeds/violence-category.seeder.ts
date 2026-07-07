import { Inject, Injectable, Logger } from '@nestjs/common';
import {
  IViolenceCategoryRepository,
  VIOLENCE_CATEGORY_REPOSITORY,
} from '../../modules/violence-categories/entity/violence-category.repository.port';
import { Locale } from '../../common/enums/locale.enum';

interface SeedCategory {
  code: string;
  sortOrder: number;
  labels: Partial<Record<Locale, string>>;
}

// Matches spec "Violence Categories" (expanded list, Phase 0 update).
const CATEGORIES: SeedCategory[] = [
  {
    code: 'PHYSICAL',
    sortOrder: 1,
    labels: { [Locale.Fr]: 'Violence physique', [Locale.En]: 'Physical violence' },
  },
  {
    code: 'SEXUAL',
    sortOrder: 2,
    labels: { [Locale.Fr]: 'Violence sexuelle', [Locale.En]: 'Sexual violence' },
  },
  {
    code: 'PSYCHOLOGICAL_VERBAL',
    sortOrder: 3,
    labels: {
      [Locale.Fr]: 'Violence psychologique / verbale',
      [Locale.En]: 'Psychological / verbal violence',
    },
  },
  {
    code: 'ECONOMIC',
    sortOrder: 4,
    labels: { [Locale.Fr]: 'Violence économique', [Locale.En]: 'Economic violence' },
  },
  {
    code: 'DENIAL_LAND_ACCESS',
    sortOrder: 5,
    labels: {
      [Locale.Fr]: "Refus d'accès à la terre ou aux ressources économiques",
      [Locale.En]: 'Denial of access to land or economic resources',
    },
  },
  {
    code: 'DENIAL_EDUCATION_ACCESS',
    sortOrder: 6,
    labels: {
      [Locale.Fr]: "Refus d'accès des enfants à l'éducation (absence d'état civil)",
      [Locale.En]: "Denial of children's access to education (no civil registration)",
    },
  },
  {
    code: 'CIVIL_DOCUMENT_CONFISCATION',
    sortOrder: 7,
    labels: {
      [Locale.Fr]: "Confiscation des documents d'état civil des enfants",
      [Locale.En]: "Confiscation of children's civil status documents",
    },
  },
  {
    code: 'CHILD_ABANDONMENT',
    sortOrder: 8,
    labels: {
      [Locale.Fr]: 'Abandon des enfants / refus de prise en charge par le père',
      [Locale.En]: 'Child abandonment / refusal of paternal care',
    },
  },
  {
    code: 'DIVORCE_REFUSAL',
    sortOrder: 9,
    labels: {
      [Locale.Fr]: 'Refus de divorce ou autre contrainte familiale',
      [Locale.En]: 'Refusal of divorce or other family coercion',
    },
  },
  {
    code: 'FGM',
    sortOrder: 10,
    labels: {
      [Locale.Fr]: 'Mutilations génitales féminines (MGF)',
      [Locale.En]: 'Female Genital Mutilation (FGM)',
    },
  },
  {
    code: 'SEXUAL_HARASSMENT',
    sortOrder: 11,
    labels: {
      [Locale.Fr]: 'Harcèlement sexuel (travail / école)',
      [Locale.En]: 'Sexual harassment (workplace / school)',
    },
  },
  { code: 'OTHER', sortOrder: 99, labels: { [Locale.Fr]: 'Autre', [Locale.En]: 'Other' } },
];

@Injectable()
export class ViolenceCategorySeeder {
  private readonly logger = new Logger(ViolenceCategorySeeder.name);

  constructor(
    @Inject(VIOLENCE_CATEGORY_REPOSITORY)
    private readonly categories: IViolenceCategoryRepository,
  ) {}

  async run(): Promise<void> {
    for (const seed of CATEGORIES) {
      const existing = await this.categories.findByCode(seed.code);
      if (existing) {
        continue;
      }
      await this.categories.create({
        code: seed.code,
        sortOrder: seed.sortOrder,
        translations: Object.entries(seed.labels).map(([locale, label]) => ({ locale, label })),
      });
      this.logger.log(`Created violence category "${seed.code}"`);
    }
  }
}
