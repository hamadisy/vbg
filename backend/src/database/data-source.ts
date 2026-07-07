import 'dotenv/config';
import 'reflect-metadata';
import { join } from 'path';
import { DataSource } from 'typeorm';

// Plain DataSource for the TypeORM CLI (migration:generate/run/revert).
// Deliberately not built through Nest DI - the CLI can't resolve ConfigService,
// so this reads env vars directly and must stay in sync with typeorm.config.ts.
export default new DataSource({
  type: 'better-sqlite3',
  database: process.env.DB_STORAGE ?? './data/vbg-dev.sqlite',
  entities: [join(__dirname, '..', '**', '*.entity{.ts,.js}')],
  migrations: [join(__dirname, 'migrations', '*{.ts,.js}')],
  migrationsTableName: 'migrations',
});
