import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { TranslationDto } from '../../../../common/dto/translation.dto';

export class CreateViolenceCategoryDto {
  @ApiProperty({ description: "Stable machine key, e.g. 'PHYSICAL'" })
  @IsString()
  code: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  sortOrder?: number;

  @ApiProperty({ type: () => TranslationDto, isArray: true })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => TranslationDto)
  translations: TranslationDto[];
}
