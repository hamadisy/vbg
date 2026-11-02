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
import { NotificationsModule } from '../../modules/notifications/notifications.module';
import { CasesModule } from '../../modules/cases/cases.module';

// Lightweight application context for the one-off Brakna CSV import, mirrors
// SeedModule but also pulls in CasesModule since this script inserts Cases
// (seed.ts never does - it only seeds reference/lookup data).
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration], validationSchema }),
    TypeOrmModule.forRootAsync({ inject: [ConfigService], useFactory: getTypeOrmConfig }),
    RegionsModule,
    ViolenceCategoriesModule,
    ReferralStructuresModule,
    UsersModule,
    NotificationsModule,
    CasesModule,
  ],
})
export class ImportBraknaCsvModule {}
