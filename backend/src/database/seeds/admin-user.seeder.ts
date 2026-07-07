import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../modules/users/control/users.service';
import { IUserRepository, USER_REPOSITORY } from '../../modules/users/entity/user.repository.port';
import { Role } from '../../common/enums/role.enum';

interface SeedAdminConfig {
  username: string;
  password: string;
  email: string;
}

@Injectable()
export class AdminUserSeeder {
  private readonly logger = new Logger(AdminUserSeeder.name);

  constructor(
    private readonly usersService: UsersService,
    @Inject(USER_REPOSITORY) private readonly users: IUserRepository,
    private readonly configService: ConfigService,
  ) {}

  async run(): Promise<void> {
    const { username, password, email } = this.configService.get<SeedAdminConfig>('app.seedAdmin')!;
    const existing = await this.users.findByUsername(username);
    if (existing) {
      this.logger.log(`Admin user "${username}" already exists, skipping`);
      return;
    }
    await this.usersService.create({
      fullName: 'CSVVDH Administrator',
      username,
      password,
      email,
      role: Role.Administrator,
    });
    this.logger.log(`Created admin user "${username}"`);
  }
}
