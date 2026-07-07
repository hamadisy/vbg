import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class NotificationRecipientResponseDto {
  @ApiProperty() @Expose() id: string;
  @ApiProperty() @Expose() name: string;
  @ApiProperty() @Expose() phone: string;
  @ApiPropertyOptional() @Expose() regionId?: string | null;
  @ApiPropertyOptional() @Expose() violenceCategoryId?: string | null;
  @ApiProperty() @Expose() isActive: boolean;
}
