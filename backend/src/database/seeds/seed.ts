import 'reflect-metadata';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SeedModule } from './seed.module';
import { RegionSeeder } from './region.seeder';
import { ViolenceCategorySeeder } from './violence-category.seeder';
import { ReferralStructureSeeder } from './referral-structure.seeder';
import { AdminUserSeeder } from './admin-user.seeder';

async function bootstrap() {
  const logger = new Logger('Seed');
  const app = await NestFactory.createApplicationContext(SeedModule, {
    logger: ['error', 'warn', 'log'],
  });

  try {
    const regions = await app.get(RegionSeeder).run();
    await app.get(ViolenceCategorySeeder).run();

    // One placeholder referral-structure set per top-level region, attached to
    // its first commune row - an Admin fills in the real per-region contacts later.
    const representativeRegions = new Map<string, (typeof regions)[number]>();
    for (const region of regions) {
      if (!representativeRegions.has(region.name)) {
        representativeRegions.set(region.name, region);
      }
    }
    for (const region of representativeRegions.values()) {
      await app.get(ReferralStructureSeeder).run(region.id);
    }

    await app.get(AdminUserSeeder).run();
    logger.log('Seed completed successfully');
  } finally {
    await app.close();
  }
}

bootstrap().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
