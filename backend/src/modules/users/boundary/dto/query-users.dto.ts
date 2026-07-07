import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsUUID } from 'class-validator';
import { Role } from '../../../../common/enums/role.enum';

export class QueryUsersDto {
  @ApiPropertyOptional({ enum: Role })
  @IsOptional()
  @IsEnum(Role)
  role?: Role;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  regionId?: string;
}
