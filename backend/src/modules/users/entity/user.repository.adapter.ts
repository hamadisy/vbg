import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { User } from './user.entity';
import { IUserRepository, UserQueryFilter } from './user.repository.port';

// Only file in this module allowed to import from 'typeorm'.
@Injectable()
export class UserTypeOrmRepository implements IUserRepository {
  constructor(@InjectRepository(User) private readonly repo: Repository<User>) {}

  findById(id: string): Promise<User | null> {
    return this.repo.findOne({ where: { id }, relations: { region: true } });
  }

  // withDeleted: true - username/email carry DB-level unique indexes that a
  // soft-delete doesn't lift, so the uniqueness check must see deleted rows
  // too or a re-used username crashes with a raw constraint-violation error
  // instead of the intended ConflictException.
  findByUsername(username: string): Promise<User | null> {
    return this.repo.findOne({ where: { username }, withDeleted: true });
  }

  findByEmail(email: string): Promise<User | null> {
    return this.repo.findOne({ where: { email }, withDeleted: true });
  }

  findAll(): Promise<User[]> {
    return this.repo.find({ relations: { region: true } });
  }

  findAllFiltered(filter?: UserQueryFilter): Promise<User[]> {
    return this.repo.find({
      where: {
        ...(filter?.role ? { role: filter.role as User['role'] } : {}),
        ...(filter?.regionId ? { regionId: filter.regionId } : {}),
      },
      relations: { region: true },
    });
  }

  create(data: DeepPartial<User>): Promise<User> {
    return this.repo.save(this.repo.create(data));
  }

  async update(id: string, data: Partial<User>): Promise<User> {
    await this.repo.update(id, data);
    const updated = await this.findById(id);
    if (!updated) {
      throw new Error(`User ${id} not found after update`);
    }
    return updated;
  }

  async softDelete(id: string): Promise<void> {
    await this.repo.softDelete(id);
  }
}
