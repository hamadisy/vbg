import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';
import { CreateReferralStructureDto } from './create-referral-structure.dto';

export class UpdateReferralStructureDto extends PartialType(CreateReferralStructureDto) {
  @ApiPropertyOptional({ description: 'Reactivate/deactivate without a separate call' })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
