import { join } from 'path';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export function getTypeOrmConfig(configService: ConfigService): TypeOrmModuleOptions {
  return {
    type: 'better-sqlite3',
    database: configService.get<string>('app.database.storage', './data/vbg-dev.sqlite'),
    entities: [join(__dirname, '..', '**', '*.entity{.ts,.js}')],
    migrations: [join(__dirname, '..', 'database', 'migrations', '*{.ts,.js}')],
    migrationsRun: false,
    // Never true: this app runs in Docker in prod and schema drift must go through
    // reviewed migrations, not implicit sync.
    synchronize: false,
    logging:
      configService.get<string>('app.nodeEnv') === 'development' ? ['error', 'warn'] : ['error'],
  };
}
