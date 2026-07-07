import { Inject, Injectable } from '@nestjs/common';
import { Role } from '../../../common/enums/role.enum';
import { AuthenticatedUser } from '../../../common/interfaces/authenticated-request.interface';
import {
  CASE_REPOSITORY,
  CaseStatsScope,
  ICaseRepository,
} from '../../cases/entity/case.repository.port';
import { DashboardStatsResponseDto } from '../boundary/dto/dashboard-stats-response.dto';

@Injectable()
export class DashboardService {
  constructor(@Inject(CASE_REPOSITORY) private readonly cases: ICaseRepository) {}

  async getStats(currentUser: AuthenticatedUser): Promise<DashboardStatsResponseDto> {
    const scope: CaseStatsScope = {};
    if (currentUser.role === Role.RegionalDirector) {
      scope.regionId = currentUser.regionId ?? undefined;
    } else if (currentUser.role === Role.CommunityRelay) {
      scope.ownerId = currentUser.id;
    }

    const [totalCases, casesByRegion, casesByViolenceCategory, casesByRegionAndCategory] =
      await Promise.all([
        this.cases.countTotal(scope),
        this.cases.countByRegion(scope),
        this.cases.countByViolenceCategory(scope),
        this.cases.countByRegionAndCategory(scope),
      ]);

    return { totalCases, casesByRegion, casesByViolenceCategory, casesByRegionAndCategory };
  }
}
