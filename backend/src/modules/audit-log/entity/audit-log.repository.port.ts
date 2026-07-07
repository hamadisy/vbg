import { ICrudRepository } from '../../../common/base/base-repository.port';
import { AuditLog } from './audit-log.entity';

export const AUDIT_LOG_REPOSITORY = Symbol('AUDIT_LOG_REPOSITORY');

export interface AuditLogQueryOptions {
  entityType?: string;
  entityId?: string;
  userId?: string;
}

export interface IAuditLogRepository extends ICrudRepository<AuditLog> {
  findAllFiltered(options: AuditLogQueryOptions): Promise<AuditLog[]>;
}
