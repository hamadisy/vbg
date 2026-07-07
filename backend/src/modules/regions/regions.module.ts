import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Region } from './entity/region.entity';
import { REGION_REPOSITORY } from './entity/region.repository.port';
import { RegionTypeOrmRepository } from './entity/region.repository.adapter';
import { RegionsController } from './boundary/regions.controller';
import { RegionsService } from './control/regions.service';

@Module({
  imports: [TypeOrmModule.forFeature([Region])],
  controllers: [RegionsController],
  providers: [RegionsService, { provide: REGION_REPOSITORY, useClass: RegionTypeOrmRepository }],
  exports: [REGION_REPOSITORY],
})
export class RegionsModule {}
