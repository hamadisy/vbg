import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RegionsModule } from '../regions/regions.module';
import { ReferralStructure } from './entity/referral-structure.entity';
import { ReferralStructureTranslation } from './entity/referral-structure-translation.entity';
import { REFERRAL_STRUCTURE_REPOSITORY } from './entity/referral-structure.repository.port';
import { ReferralStructureTypeOrmRepository } from './entity/referral-structure.repository.adapter';
import { ReferralStructuresController } from './boundary/referral-structures.controller';
import { ReferralStructuresService } from './control/referral-structures.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ReferralStructure, ReferralStructureTranslation]),
    RegionsModule,
  ],
  controllers: [ReferralStructuresController],
  providers: [
    ReferralStructuresService,
    { provide: REFERRAL_STRUCTURE_REPOSITORY, useClass: ReferralStructureTypeOrmRepository },
  ],
  exports: [REFERRAL_STRUCTURE_REPOSITORY],
})
export class ReferralStructuresModule {}
