import { apiClient } from './client';
import type { components } from './schema';

export type AuditLogEntry = components['schemas']['AuditLogResponseDto'];

export interface AuditLogFilters {
  entityType?: string;
  entityId?: string;
  userId?: string;
}

// Admin-only on the backend (AuditLogController is @Roles(Role.Administrator))
// - callers must only render this for administrators.
export async function listAuditLog(filters: AuditLogFilters = {}): Promise<AuditLogEntry[]> {
  const { data } = await apiClient.get<AuditLogEntry[]>('/audit-log', { params: filters });
  return data;
}
