import { Inject, Injectable, Logger } from '@nestjs/common';
import { NotificationRecipientsService } from '../../modules/notifications/control/notification-recipients.service';
import {
  IViolenceCategoryRepository,
  VIOLENCE_CATEGORY_REPOSITORY,
} from '../../modules/violence-categories/entity/violence-category.repository.port';
import { Region } from '../../modules/regions/entity/region.entity';

interface SeedRecipient {
  name: string;
  phone: string;
  regionKey?: string; // "region name|municipality" - omit for "all regions"
  categoryCode?: string; // violence category code - omit for "all categories"
}

const RECIPIENTS_SEED: SeedRecipient[] = [
  { name: 'Global Supervisor Lalla Aicha', phone: '22246413216' },
  { name: 'Nouakchott Representant', phone: '491797913398', regionKey: 'Nouakchott|Nord' },
  {
    name: 'Sexual Violence Specialist',
    phone: '4915252048950',
    regionKey: 'Nouakchott|Nord',
    categoryCode: 'SEXUAL',
  },
  { name: 'Global Supervisor Vieux', phone: '491797913398' },
];

@Injectable()
export class NotificationRecipientSeeder {
  private readonly logger = new Logger(NotificationRecipientSeeder.name);

  constructor(
    private readonly recipientsService: NotificationRecipientsService,
    @Inject(VIOLENCE_CATEGORY_REPOSITORY)
    private readonly categories: IViolenceCategoryRepository,
  ) {}

  async run(regions: Region[]): Promise<void> {
    const regionsByKey = new Map(regions.map((r) => [`${r.name}|${r.municipality}`, r]));
    const existing = await this.recipientsService.findAll({ includeInactive: true });
    const existingNames = new Set(existing.map((r) => r.name));

    for (const seed of RECIPIENTS_SEED) {
      if (existingNames.has(seed.name)) {
        continue;
      }
      const regionId = seed.regionKey ? regionsByKey.get(seed.regionKey)?.id : undefined;
      const violenceCategoryId = seed.categoryCode
        ? (await this.categories.findByCode(seed.categoryCode))?.id
        : undefined;

      await this.recipientsService.create({
        name: seed.name,
        phone: seed.phone,
        regionId,
        violenceCategoryId,
      });
      this.logger.log(`Created notification recipient "${seed.name}"`);
    }
  }
}
