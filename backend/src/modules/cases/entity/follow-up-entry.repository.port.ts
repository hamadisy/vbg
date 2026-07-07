import { DeepPartial } from 'typeorm';
import { FollowUpEntry } from './follow-up-entry.entity';

export const FOLLOW_UP_ENTRY_REPOSITORY = Symbol('FOLLOW_UP_ENTRY_REPOSITORY');

export interface IFollowUpEntryRepository {
  create(data: DeepPartial<FollowUpEntry>): Promise<FollowUpEntry>;
}
