import { Inject, Injectable, Logger } from '@nestjs/common';
import {
  IRegionRepository,
  REGION_REPOSITORY,
} from '../../modules/regions/entity/region.repository.port';
import { Region } from '../../modules/regions/entity/region.entity';

const REGIONS_SEED = [
  { name: 'Nouakchott', municipality: 'Nord' },
  { name: 'Nouakchott', municipality: 'Est' },
  { name: 'Nouakchott', municipality: 'Sud' },
  { name: 'Brakna', municipality: 'Boghé' },
  { name: 'Brakna', municipality: 'Dar el Avia' },
  { name: 'Brakna', municipality: 'Dar el Barka' },
  { name: 'Brakna', municipality: 'o Birom' },
  { name: 'Brakna', municipality: 'Bababe' },
  { name: 'Brakna', municipality: 'El vorh' },
  { name: 'Brakna', municipality: 'Aere mbar' },
  { name: 'Brakna', municipality: 'Aleg' },
  { name: 'Brakna', municipality: 'Bouhdida' },
  { name: 'Gorgol', municipality: 'Kaedi' },
  { name: 'Gorgol', municipality: 'Djewol' },
  { name: 'Gorgol', municipality: 'Belinabe talhaya' },
];

@Injectable()
export class RegionSeeder {
  private readonly logger = new Logger(RegionSeeder.name);

  constructor(@Inject(REGION_REPOSITORY) private readonly regions: IRegionRepository) {}

  /** Returns every region+commune row that now exists (pre-existing plus newly created). */
  async run(): Promise<Region[]> {
    const existing = await this.regions.findAllFiltered(true);
    const existingKeys = new Set(existing.map((r) => `${r.name}|${r.municipality}`));

    const all: Region[] = [...existing];
    for (const seed of REGIONS_SEED) {
      if (existingKeys.has(`${seed.name}|${seed.municipality}`)) {
        continue;
      }
      const region = await this.regions.create(seed);
      this.logger.log(`Created region "${region.name} - ${region.municipality}"`);
      all.push(region);
    }
    return all;
  }
}
