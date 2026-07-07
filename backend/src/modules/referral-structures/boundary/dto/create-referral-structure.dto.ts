import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { TranslationDto } from '../../../../common/dto/translation.dto';
import { ReferralStructureType } from '../../entity/enums/referral-structure-type.enum';

export class CreateReferralStructureDto {
  @ApiProperty({ enum: ReferralStructureType })
  @IsEnum(ReferralStructureType)
  type: ReferralStructureType;

  @ApiProperty({ description: 'Specific named organization/contact' })
  @IsString()
  name: string;

  @ApiProperty()
  @IsUUID()
  regionId: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  contactPhone?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  contactEmail?: string;

  @ApiProperty({ type: () => TranslationDto, isArray: true })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => TranslationDto)
  translations: TranslationDto[];
}
