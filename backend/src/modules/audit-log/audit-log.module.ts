import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditLog } from './entity/audit-log.entity';
import { AUDIT_LOG_REPOSITORY } from './entity/audit-log.repository.port';
import { AuditLogTypeOrmRepository } from './entity/audit-log.repository.adapter';
import { AuditLogController } from './boundary/audit-log.controller';
import { AuditLogService } from './control/audit-log.service';

@Module({
  imports: [TypeOrmModule.forFeature([AuditLog])],
  controllers: [AuditLogController],
  providers: [
    AuditLogService,
    { provide: AUDIT_LOG_REPOSITORY, useClass: AuditLogTypeOrmRepository },
  ],
  exports: [AuditLogService],
})
export class AuditLogModule {}
