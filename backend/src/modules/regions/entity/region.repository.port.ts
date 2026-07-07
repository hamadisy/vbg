import { ICrudRepository } from '../../../common/base/base-repository.port';
import { Region } from './region.entity';

export const REGION_REPOSITORY = Symbol('REGION_REPOSITORY');

export interface IRegionRepository extends ICrudRepository<Region> {
  findByName(name: string): Promise<Region | null>;
  findAllFiltered(includeInactive: boolean): Promise<Region[]>;
  update(id: string, data: Partial<Region>): Promise<Region>;
}
