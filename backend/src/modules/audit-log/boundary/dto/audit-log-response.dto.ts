import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { AuditAction } from '../../../../common/enums/audit-action.enum';

// Explicit allow-list mapping, same pattern as UserResponseDto - the acting
// user's passwordHash must never leak through here.
export class AuditLogUserSummaryDto {
  @ApiProperty() @Expose() id: string;
  @ApiProperty() @Expose() fullName: string;
  @ApiProperty() @Expose() username: string;
}

export class AuditLogResponseDto {
  @ApiProperty() @Expose() id: string;

  @ApiProperty({ type: () => AuditLogUserSummaryDto })
  @Expose()
  @Type(() => AuditLogUserSummaryDto)
  user: AuditLogUserSummaryDto;

  @ApiProperty({ enum: AuditAction }) @Expose() action: AuditAction;
  @ApiProperty() @Expose() entityType: string;
  @ApiProperty() @Expose() entityId: string;
  @ApiPropertyOptional() @Expose() details?: string;
  @ApiProperty() @Expose() timestamp: Date;
}
