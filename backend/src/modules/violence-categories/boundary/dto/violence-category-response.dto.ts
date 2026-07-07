import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { TranslationDto } from '../../../../common/dto/translation.dto';

export class ViolenceCategoryResponseDto {
  @ApiProperty() @Expose() id: string;
  @ApiProperty() @Expose() code: string;
  @ApiProperty() @Expose() isActive: boolean;
  @ApiProperty() @Expose() sortOrder: number;

  @ApiProperty({ type: () => TranslationDto, isArray: true })
  @Expose()
  @Type(() => TranslationDto)
  translations: TranslationDto[];
}
