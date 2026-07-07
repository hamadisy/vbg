import { ICrudRepository } from '../../../common/base/base-repository.port';
import { Victim } from './victim.entity';

export const VICTIM_REPOSITORY = Symbol('VICTIM_REPOSITORY');

export interface IVictimRepository extends ICrudRepository<Victim> {
  update(id: string, data: Partial<Victim>): Promise<Victim>;
}
