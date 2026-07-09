import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID, Matches } from 'class-validator';
import { Transform } from 'class-transformer';

// E.164 without the leading '+' - the format Vonage's SMS API expects for "to".
const E164_NO_PLUS = /^[1-9]\d{7,14}$/;

export class CreateNotificationRecipientDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({ example: '2250700000000', description: 'E.164 format, no leading +' })
  @Transform(({ value }) => (typeof value === 'string' ? value.replace(/[\s-]/g, '').replace(/^\+/, '') : value))
  @Matches(E164_NO_PLUS, { message: 'phone must be in E.164 format, e.g. 2250700000000' })
  phone: string;

  @ApiPropertyOptional({ description: 'Omit for "all regions"' })
  @IsOptional()
  @IsUUID()
  regionId?: string;

  @ApiPropertyOptional({ description: 'Omit for "all violence categories"' })
  @IsOptional()
  @IsUUID()
  violenceCategoryId?: string;
}
