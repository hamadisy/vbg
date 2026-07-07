import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from '../../../common/decorators/roles.decorator';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { Role } from '../../../common/enums/role.enum';
import { AuthenticatedUser } from '../../../common/interfaces/authenticated-request.interface';
import { DashboardService } from '../control/dashboard.service';
import { DashboardStatsResponseDto } from './dto/dashboard-stats-response.dto';

// Community Relay sees stats scoped to their own cases only (via ownerId in
// DashboardService); Regional Director is region-scoped; Institutional
// User/Administrator see global stats.
@ApiTags('dashboard')
@ApiBearerAuth()
@Roles(Role.CommunityRelay, Role.RegionalDirector, Role.InstitutionalUser, Role.Administrator)
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  getStats(@CurrentUser() user: AuthenticatedUser): Promise<DashboardStatsResponseDto> {
    return this.dashboardService.getStats(user);
  }
}
