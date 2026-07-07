import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { Roles } from '../../../common/decorators/roles.decorator';
import { Role } from '../../../common/enums/role.enum';
import { User } from '../entity/user.entity';
import { UsersService } from '../control/users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { QueryUsersDto } from './dto/query-users.dto';
import { UserResponseDto } from './dto/user-response.dto';

@ApiTags('users')
@ApiBearerAuth()
@Roles(Role.Administrator)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() dto: CreateUserDto): Promise<UserResponseDto> {
    const user = await this.usersService.create(dto);
    return this.toResponse(user);
  }

  @Get()
  async findAll(@Query() query: QueryUsersDto): Promise<UserResponseDto[]> {
    const users = await this.usersService.findAll(query);
    return users.map((user) => this.toResponse(user));
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<UserResponseDto> {
    const user = await this.usersService.findById(id);
    return this.toResponse(user);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    const user = await this.usersService.update(id, dto);
    return this.toResponse(user);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.usersService.remove(id);
  }

  private toResponse(user: User): UserResponseDto {
    return plainToInstance(UserResponseDto, user, { excludeExtraneousValues: true });
  }
}
