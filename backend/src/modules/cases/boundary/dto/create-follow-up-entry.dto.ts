import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';
import { FollowUpOutcome } from '../../entity/enums/follow-up-outcome.enum';

export class CreateFollowUpEntryDto {
  @ApiProperty()
  @IsString()
  comment: string;

  @ApiProperty({ enum: FollowUpOutcome })
  @IsEnum(FollowUpOutcome)
  outcome: FollowUpOutcome;
}
