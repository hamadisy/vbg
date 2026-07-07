import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';
import { CreateNotificationRecipientDto } from './create-notification-recipient.dto';

export class UpdateNotificationRecipientDto extends PartialType(CreateNotificationRecipientDto) {
  @ApiPropertyOptional({ description: 'Reactivate/deactivate without a separate call' })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
