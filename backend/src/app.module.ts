import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import configuration from './config/configuration';
import { validationSchema } from './config/validation.schema';
import { getTypeOrmConfig } from './config/typeorm.config';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { RolesGuard } from './common/guards/roles.guard';
import { RegionScopeGuard } from './common/guards/region-scope.guard';
import { OwnershipScopeGuard } from './common/guards/ownership-scope.guard';
import { AuditInterceptor } from './common/interceptors/audit.interceptor';
import { HealthModule } from './modules/health/health.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { RegionsModule } from './modules/regions/regions.module';
import { ViolenceCategoriesModule } from './modules/violence-categories/violence-categories.module';
import { ReferralStructuresModule } from './modules/referral-structures/referral-structures.module';
import { CasesModule } from './modules/cases/cases.module';
import { AuditLogModule } from './modules/audit-log/audit-log.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validationSchema,
      envFilePath: ['.env.local', `.env.${process.env.NODE_ENV ?? 'development'}`, '.env'],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: getTypeOrmConfig,
    }),
    HealthModule,
    AuthModule,
    UsersModule,
    RegionsModule,
    ViolenceCategoriesModule,
    ReferralStructuresModule,
    CasesModule,
    AuditLogModule,
    NotificationsModule,
    DashboardModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
    { provide: APP_GUARD, useClass: RegionScopeGuard },
    { provide: APP_GUARD, useClass: OwnershipScopeGuard },
    { provide: APP_INTERCEPTOR, useClass: AuditInterceptor },
  ],
})
export class AppModule {}
