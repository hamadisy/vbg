import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';
import { CreateViolenceCategoryDto } from './create-violence-category.dto';

export class UpdateViolenceCategoryDto extends PartialType(CreateViolenceCategoryDto) {
  @ApiPropertyOptional({ description: 'Reactivate/deactivate without a separate call' })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
