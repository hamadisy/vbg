import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsOptional, IsString, IsUUID, MinLength } from 'class-validator';
import { Role } from '../../../../common/enums/role.enum';

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  fullName: string;

  @ApiProperty()
  @IsString()
  @MinLength(3)
  username: string;

  @ApiProperty()
  @IsString()
  @MinLength(8)
  password: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ enum: Role })
  @IsEnum(Role)
  role: Role;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  regionId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  language?: string;
}
