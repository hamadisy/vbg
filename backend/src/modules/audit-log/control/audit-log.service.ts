import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { AuditAction } from '../../../common/enums/audit-action.enum';
import {
  AUDIT_LOG_REPOSITORY,
  AuditLogQueryOptions,
  IAuditLogRepository,
} from '../entity/audit-log.repository.port';
import { AuditLog } from '../entity/audit-log.entity';

export interface RecordAuditLogInput {
  userId: string;
  action: AuditAction;
  entityType: string;
  entityId: string;
  details?: string;
}

@Injectable()
export class AuditLogService {
  constructor(@Inject(AUDIT_LOG_REPOSITORY) private readonly auditLogs: IAuditLogRepository) {}

  // Used by AuditInterceptor - fire-and-forget from the caller's perspective.
  async record(input: RecordAuditLogInput): Promise<void> {
    await this.auditLogs.create(input);
  }

  findAll(options: AuditLogQueryOptions): Promise<AuditLog[]> {
    return this.auditLogs.findAllFiltered(options);
  }

  async findById(id: string): Promise<AuditLog> {
    const entry = await this.auditLogs.findById(id);
    if (!entry) {
      throw new NotFoundException('Audit log entry not found');
    }
    return entry;
  }
}
