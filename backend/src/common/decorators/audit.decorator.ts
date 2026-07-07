import { SetMetadata } from '@nestjs/common';
import { AuditAction } from '../enums/audit-action.enum';

export const AUDIT_KEY = 'audit';

export interface AuditMetadata {
  entityType: string;
  action: AuditAction;
}

/**
 * Marks a route for audit logging. AuditInterceptor is a no-op when this
 * metadata is absent, same pattern as the scope guards.
 */
export const Audit = (entityType: string, action: AuditAction) =>
  SetMetadata<string, AuditMetadata>(AUDIT_KEY, { entityType, action });
