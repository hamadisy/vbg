import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationsModule } from '../notifications/notifications.module';
import { Case } from './entity/case.entity';
import { Victim } from './entity/victim.entity';
import { FollowUpEntry } from './entity/follow-up-entry.entity';
import { CASE_REPOSITORY } from './entity/case.repository.port';
import { CaseTypeOrmRepository } from './entity/case.repository.adapter';
import { VICTIM_REPOSITORY } from './entity/victim.repository.port';
import { VictimTypeOrmRepository } from './entity/victim.repository.adapter';
import { FOLLOW_UP_ENTRY_REPOSITORY } from './entity/follow-up-entry.repository.port';
import { FollowUpEntryTypeOrmRepository } from './entity/follow-up-entry.repository.adapter';
import { CasesController } from './boundary/cases.controller';
import { PublicStatsController } from './boundary/public-stats.controller';
import { CasesService } from './control/cases.service';

@Module({
  imports: [TypeOrmModule.forFeature([Case, Victim, FollowUpEntry]), NotificationsModule],
  controllers: [CasesController, PublicStatsController],
  providers: [
    CasesService,
    { provide: CASE_REPOSITORY, useClass: CaseTypeOrmRepository },
    { provide: VICTIM_REPOSITORY, useClass: VictimTypeOrmRepository },
    { provide: FOLLOW_UP_ENTRY_REPOSITORY, useClass: FollowUpEntryTypeOrmRepository },
  ],
  exports: [CASE_REPOSITORY, VICTIM_REPOSITORY],
})
export class CasesModule {}
