import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Region } from './region.entity';
import { TypeOrmBaseRepository } from '../../../common/base/base-typeorm.repository';
import { IRegionRepository } from './region.repository.port';

// Only file in this module allowed to import from 'typeorm'.
@Injectable()
export class RegionTypeOrmRepository
  extends TypeOrmBaseRepository<Region>
  implements IRegionRepository
{
  constructor(@InjectRepository(Region) repo: Repository<Region>) {
    super(repo);
  }

  findByName(name: string): Promise<Region | null> {
    return this.repo.findOneBy({ name });
  }

  findAllFiltered(includeInactive: boolean): Promise<Region[]> {
    return this.repo.find({ where: includeInactive ? {} : { isActive: true } });
  }

  async update(id: string, data: Partial<Region>): Promise<Region> {
    await this.repo.update(id, data);
    const updated = await this.findById(id);
    if (!updated) {
      throw new Error(`Region ${id} not found after update`);
    }
    return updated;
  }
}
