import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class RegionResponseDto {
  @ApiProperty() @Expose() id: string;
  @ApiProperty() @Expose() name: string;
  @ApiProperty() @Expose() municipality: string;
  @ApiPropertyOptional() @Expose() village?: string;
  @ApiProperty() @Expose() isActive: boolean;
}
