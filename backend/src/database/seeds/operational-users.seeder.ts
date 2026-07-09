import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../modules/users/control/users.service';
import { IUserRepository, USER_REPOSITORY } from '../../modules/users/entity/user.repository.port';
import { Role } from '../../common/enums/role.enum';
import { Region } from '../../modules/regions/entity/region.entity';

interface SeedUser {
  username: string;
  fullName: string;
  role: Role;
  regionKey?: string; // "region name|municipality" - omit for no region scope
  language: string;
}

// Demo/working users an Admin created via the Users admin page across roles
// and regions - reproduced here so a DB reset restores the same working set.
// Passwords can't be reproduced (bcrypt is one-way): every user seeded here
// gets the shared SEED_USER_PASSWORD placeholder and needs its real password
// reset via the Users admin page after a fresh seed.
const OPERATIONAL_USERS_SEED: SeedUser[] = [
  {
    username: 'relay1',
    fullName: 'Relay Nktt Nord',
    role: Role.CommunityRelay,
    regionKey: 'Nouakchott|Nord',
    language: 'fr',
  },
  {
    username: 'director-a',
    fullName: 'Directeur Nktt',
    role: Role.RegionalDirector,
    regionKey: 'Nouakchott|Nord',
    language: 'en',
  },
  {
    username: 'institutional1',
    fullName: 'Institutional One',
    role: Role.InstitutionalUser,
    regionKey: 'Brakna|Bababe',
    language: 'fr',
  },
  {
    username: 'relay2',
    fullName: 'Relay Brakna el-vorh',
    role: Role.CommunityRelay,
    regionKey: 'Brakna|El vorh',
    language: 'ar',
  },
];

@Injectable()
export class OperationalUsersSeeder {
  private readonly logger = new Logger(OperationalUsersSeeder.name);

  constructor(
    private readonly usersService: UsersService,
    @Inject(USER_REPOSITORY) private readonly users: IUserRepository,
    private readonly configService: ConfigService,
  ) {}

  async run(regions: Region[]): Promise<void> {
    const regionsByKey = new Map(regions.map((r) => [`${r.name}|${r.municipality}`, r]));
    const password = this.configService.get<string>('app.seedUser.password')!;

    for (const seed of OPERATIONAL_USERS_SEED) {
      const existing = await this.users.findByUsername(seed.username);
      if (existing) {
        continue;
      }
      const regionId = seed.regionKey ? regionsByKey.get(seed.regionKey)?.id : undefined;
      await this.usersService.create({
        fullName: seed.fullName,
        username: seed.username,
        password,
        role: seed.role,
        regionId,
        language: seed.language,
      });
      this.logger.log(
        `Created operational user "${seed.username}" with placeholder password - rotate it via the Users admin page`,
      );
    }
  }
}
