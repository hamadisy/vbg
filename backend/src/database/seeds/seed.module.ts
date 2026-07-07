import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import configuration from '../../config/configuration';
import { validationSchema } from '../../config/validation.schema';
import { getTypeOrmConfig } from '../../config/typeorm.config';
import { RegionsModule } from '../../modules/regions/regions.module';
import { ViolenceCategoriesModule } from '../../modules/violence-categories/violence-categories.module';
import { ReferralStructuresModule } from '../../modules/referral-structures/referral-structures.module';
import { UsersModule } from '../../modules/users/users.module';
import { RegionSeeder } from './region.seeder';
import { ViolenceCategorySeeder } from './violence-category.seeder';
import { ReferralStructureSeeder } from './referral-structure.seeder';
import { AdminUserSeeder } from './admin-user.seeder';

// Lightweight application context for `npm run seed` - reuses real repository
// tokens and UsersService (password hashing) rather than a bare TypeORM script,
// but skips Auth/HTTP/guards entirely since seeding needs none of that.
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration], validationSchema }),
    TypeOrmModule.forRootAsync({ inject: [ConfigService], useFactory: getTypeOrmConfig }),
    RegionsModule,
    ViolenceCategoriesModule,
    ReferralStructuresModule,
    UsersModule,
  ],
  providers: [RegionSeeder, ViolenceCategorySeeder, ReferralStructureSeeder, AdminUserSeeder],
})
export class SeedModule {}
