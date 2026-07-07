import { DeepPartial } from 'typeorm';

/** Minimal port every entity-specific repository interface extends. */
export interface ICrudRepository<T> {
  findById(id: string): Promise<T | null>;
  findAll(): Promise<T[]>;
  create(data: DeepPartial<T>): Promise<T>;
}
