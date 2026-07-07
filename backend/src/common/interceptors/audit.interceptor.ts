import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AUDIT_KEY, AuditMetadata } from '../decorators/audit.decorator';
import { AuthenticatedRequest } from '../interfaces/authenticated-request.interface';
import { AuditLogService } from '../../modules/audit-log/control/audit-log.service';

// Global (registered as APP_INTERCEPTOR) - no-op unless the route carries
// @Audit() metadata. Only logs on success (tap's success channel never fires
// for a thrown/rejected handler) and never blocks or fails the request itself
// if writing the log entry errors, same resilience contract as Notifications.
@Injectable()
export class AuditInterceptor implements NestInterceptor {
  private readonly logger = new Logger(AuditInterceptor.name);

  constructor(
    private readonly reflector: Reflector,
    private readonly auditLogService: AuditLogService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const meta = this.reflector.get<AuditMetadata | undefined>(AUDIT_KEY, context.getHandler());
    if (!meta) {
      return next.handle();
    }

    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();

    return next.handle().pipe(
      tap((result) => {
        if (!request.user) {
          return;
        }
        const entityId = (request.params?.id as string | undefined) ?? this.extractId(result);
        if (!entityId) {
          return;
        }

        this.auditLogService
          .record({
            userId: request.user.id,
            action: meta.action,
            entityType: meta.entityType,
            entityId,
            details: this.buildDetails(request.body as unknown),
          })
          .catch((error: unknown) => {
            this.logger.error(
              `Failed to write audit log for ${meta.entityType}:${entityId}`,
              error instanceof Error ? error.stack : String(error),
            );
          });
      }),
    );
  }

  private extractId(result: unknown): string | undefined {
    if (result && typeof result === 'object' && 'id' in result) {
      return (result as { id?: unknown }).id as string | undefined;
    }
    return undefined;
  }

  private buildDetails(body: unknown): string | undefined {
    if (!body || typeof body !== 'object' || Object.keys(body).length === 0) {
      return undefined;
    }
    try {
      const json = JSON.stringify(body);
      return json.length > 2000 ? `${json.slice(0, 2000)}…` : json;
    } catch {
      return undefined;
    }
  }
}
