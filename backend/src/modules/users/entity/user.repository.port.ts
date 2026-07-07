import { ICrudRepository } from '../../../common/base/base-repository.port';
import { User } from './user.entity';

export const USER_REPOSITORY = Symbol('USER_REPOSITORY');

export interface UserQueryFilter {
  role?: string;
  regionId?: string;
}

export interface IUserRepository extends ICrudRepository<User> {
  findByUsername(username: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findAllFiltered(filter?: UserQueryFilter): Promise<User[]>;
  update(id: string, data: Partial<User>): Promise<User>;
  softDelete(id: string): Promise<void>;
}
