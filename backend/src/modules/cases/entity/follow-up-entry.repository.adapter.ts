import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { FollowUpEntry } from './follow-up-entry.entity';
import { IFollowUpEntryRepository } from './follow-up-entry.repository.port';

// Only file in this module allowed to import from 'typeorm'.
@Injectable()
export class FollowUpEntryTypeOrmRepository implements IFollowUpEntryRepository {
  constructor(@InjectRepository(FollowUpEntry) private readonly repo: Repository<FollowUpEntry>) {}

  create(data: DeepPartial<FollowUpEntry>): Promise<FollowUpEntry> {
    return this.repo.save(this.repo.create(data));
  }
}
