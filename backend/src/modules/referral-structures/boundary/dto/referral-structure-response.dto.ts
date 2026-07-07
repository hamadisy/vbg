import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { TranslationDto } from '../../../../common/dto/translation.dto';
import { ReferralStructureType } from '../../entity/enums/referral-structure-type.enum';

export class ReferralStructureResponseDto {
  @ApiProperty() @Expose() id: string;
  @ApiProperty({ enum: ReferralStructureType }) @Expose() type: ReferralStructureType;
  @ApiProperty() @Expose() name: string;
  @ApiProperty() @Expose() regionId: string;
  @ApiPropertyOptional() @Expose() contactPhone?: string;
  @ApiPropertyOptional() @Expose() contactEmail?: string;
  @ApiProperty() @Expose() isActive: boolean;

  @ApiProperty({ type: () => TranslationDto, isArray: true })
  @Expose()
  @Type(() => TranslationDto)
  translations: TranslationDto[];
}
