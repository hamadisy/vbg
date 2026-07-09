import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { AuditLog } from './audit-log.entity';
import { TypeOrmBaseRepository } from '../../../common/base/base-typeorm.repository';
import { AuditLogQueryOptions, IAuditLogRepository } from './audit-log.repository.port';

// Only file in this module allowed to import from 'typeorm'.
@Injectable()
export class AuditLogTypeOrmRepository
  extends TypeOrmBaseRepository<AuditLog>
  implements IAuditLogRepository
{
  constructor(@InjectRepository(AuditLog) repo: Repository<AuditLog>) {
    super(repo);
  }

  // Overrides the base (relation-free) findById - the admin-facing read API
  // always wants the acting user's name/username alongside the raw userId.
  findById(id: string): Promise<AuditLog | null> {
    return this.repo.findOne({ where: { id }, relations: { user: true }, withDeleted: true });
  }

  findAllFiltered(options: AuditLogQueryOptions): Promise<AuditLog[]> {
    const where: FindOptionsWhere<AuditLog> = {};
    if (options.entityType) where.entityType = options.entityType;
    if (options.entityId) where.entityId = options.entityId;
    if (options.userId) where.userId = options.userId;

    return this.repo.find({
      where,
      relations: { user: true },
      order: { timestamp: 'DESC' },
      // Soft-deleted users must still resolve here - the audit trail needs to
      // show who performed an action even after that user is later removed.
      withDeleted: true,
    });
  }
}
