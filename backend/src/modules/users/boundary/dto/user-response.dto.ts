import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { Role } from '../../../../common/enums/role.enum';

// Explicit allow-list mapping - passwordHash must never be exposed via this DTO.
export class UserResponseDto {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty()
  @Expose()
  fullName: string;

  @ApiProperty()
  @Expose()
  username: string;

  @ApiPropertyOptional()
  @Expose()
  phone?: string;

  @ApiPropertyOptional()
  @Expose()
  email?: string;

  @ApiProperty({ enum: Role })
  @Expose()
  role: Role;

  @ApiPropertyOptional()
  @Expose()
  regionId?: string | null;

  @ApiProperty()
  @Expose()
  language: string;

  @ApiProperty()
  @Expose()
  createdAt: Date;

  @ApiProperty()
  @Expose()
  updatedAt: Date;
}
