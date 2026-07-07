import { DeepPartial, ObjectLiteral, Repository } from 'typeorm';
import { ICrudRepository } from './base-repository.port';

/**
 * Shared TypeORM adapter for simple master-data entities (id + findById/findAll/create).
 * Concrete repositories extend this and add entity-specific queries; the port/adapter
 * split is preserved because callers still depend on the ICrudRepository interface,
 * never on this class or on typeorm.Repository directly.
 */
export abstract class TypeOrmBaseRepository<T extends ObjectLiteral> implements ICrudRepository<T> {
  protected constructor(protected readonly repo: Repository<T>) {}

  findById(id: string): Promise<T | null> {
    return this.repo.findOneBy({ id } as unknown as Parameters<typeof this.repo.findOneBy>[0]);
  }

  findAll(): Promise<T[]> {
    return this.repo.find();
  }

  create(data: DeepPartial<T>): Promise<T> {
    return this.repo.save(this.repo.create(data));
  }
}
