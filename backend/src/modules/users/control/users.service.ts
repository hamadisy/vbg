import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { IUserRepository, USER_REPOSITORY, UserQueryFilter } from '../entity/user.repository.port';
import { User } from '../entity/user.entity';
import { CreateUserDto } from '../boundary/dto/create-user.dto';
import { UpdateUserDto } from '../boundary/dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @Inject(USER_REPOSITORY) private readonly users: IUserRepository,
    private readonly configService: ConfigService,
  ) {}

  async create(dto: CreateUserDto): Promise<User> {
    const existing = await this.users.findByUsername(dto.username);
    if (existing) {
      throw new ConflictException('Username already in use');
    }
    if (dto.email) {
      const existingEmail = await this.users.findByEmail(dto.email);
      if (existingEmail) {
        throw new ConflictException('Email already in use');
      }
    }
    const saltRounds = this.configService.get<number>('app.bcryptSaltRounds', 12);
    const { password, ...rest } = dto;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    return this.users.create({ ...rest, passwordHash });
  }

  findAll(filter?: UserQueryFilter): Promise<User[]> {
    return this.users.findAllFiltered(filter);
  }

  async findById(id: string): Promise<User> {
    const user = await this.users.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async update(id: string, dto: UpdateUserDto): Promise<User> {
    await this.findById(id);
    const { password, ...rest } = dto;
    const data: Partial<User> = { ...rest };
    if (password) {
      const saltRounds = this.configService.get<number>('app.bcryptSaltRounds', 12);
      data.passwordHash = await bcrypt.hash(password, saltRounds);
    }
    return this.users.update(id, data);
  }

  async remove(id: string): Promise<void> {
    await this.findById(id);
    await this.users.softDelete(id);
  }
}
