import { Controller, Get, Param, ParseUUIDPipe, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { Roles } from '../../../common/decorators/roles.decorator';
import { Role } from '../../../common/enums/role.enum';
import { AuditLog } from '../entity/audit-log.entity';
import { AuditLogService } from '../control/audit-log.service';
import { QueryAuditLogDto } from './dto/query-audit-log.dto';
import { AuditLogResponseDto } from './dto/audit-log-response.dto';

// Read-only and Admin-only. Entries are written exclusively by
// AuditInterceptor - no POST/PATCH/DELETE here, since an audit trail that
// can be edited or erased via its own API isn't a trustworthy one.
@ApiTags('audit-log')
@ApiBearerAuth()
@Roles(Role.Administrator)
@Controller('audit-log')
export class AuditLogController {
  constructor(private readonly auditLogService: AuditLogService) {}

  @Get()
  async findAll(@Query() query: QueryAuditLogDto): Promise<AuditLogResponseDto[]> {
    const entries = await this.auditLogService.findAll(query);
    return entries.map((entry) => this.toResponse(entry));
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<AuditLogResponseDto> {
    const entry = await this.auditLogService.findById(id);
    return this.toResponse(entry);
  }

  private toResponse(entity: AuditLog): AuditLogResponseDto {
    return plainToInstance(AuditLogResponseDto, entity, { excludeExtraneousValues: true });
  }
}
