import { Module } from '@nestjs/common';
import { CasesModule } from '../cases/cases.module';
import { DashboardController } from './boundary/dashboard.controller';
import { DashboardService } from './control/dashboard.service';

@Module({
  imports: [CasesModule],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
