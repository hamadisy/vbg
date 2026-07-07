import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';

// Shared by ViolenceCategory/ReferralStructure create+update DTOs - not a
// hardcoded locale enum, see spec "Multilingual Support" (new language = new rows).
// Also reused (with @Expose) as the nested shape inside their response DTOs.
export class TranslationDto {
  @ApiProperty()
  @Expose()
  @IsString()
  locale: string;

  @ApiProperty()
  @Expose()
  @IsString()
  label: string;
}
