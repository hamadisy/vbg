import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';
import { CreateRegionDto } from './create-region.dto';

export class UpdateRegionDto extends PartialType(CreateRegionDto) {
  @ApiPropertyOptional({ description: 'Reactivate/deactivate without a separate call' })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
