import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Victim } from './victim.entity';
import { TypeOrmBaseRepository } from '../../../common/base/base-typeorm.repository';
import { IVictimRepository } from './victim.repository.port';

// Only file in this module allowed to import from 'typeorm'.
@Injectable()
export class VictimTypeOrmRepository
  extends TypeOrmBaseRepository<Victim>
  implements IVictimRepository
{
  constructor(@InjectRepository(Victim) repo: Repository<Victim>) {
    super(repo);
  }

  async update(id: string, data: Partial<Victim>): Promise<Victim> {
    await this.repo.update(id, data);
    const updated = await this.findById(id);
    if (!updated) {
      throw new Error(`Victim ${id} not found after update`);
    }
    return updated;
  }
}
