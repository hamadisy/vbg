import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { CaseStatus } from '../../entity/enums/case-status.enum';

export class UpdateCaseStatusDto {
  @ApiProperty({ enum: CaseStatus })
  @IsEnum(CaseStatus)
  status: CaseStatus;
}
