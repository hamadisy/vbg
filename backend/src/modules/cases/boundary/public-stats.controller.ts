import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '../../../common/decorators/public.decorator';
import { CasesService } from '../control/cases.service';
import { OpenCasesCountResponseDto } from './dto/open-cases-count-response.dto';

// Deliberately unauthenticated - backs a badge shown even on the login page.
// Kept in its own controller (rather than on CasesController) so it can't
// collide with the /cases/:id route and so its public exposure stays explicit.
@ApiTags('public-stats')
@Controller('public-stats')
export class PublicStatsController {
  constructor(private readonly casesService: CasesService) {}

  @Public()
  @Get('open-cases-count')
  async getOpenCasesCount(): Promise<OpenCasesCountResponseDto> {
    const count = await this.casesService.countOpen();
    return { count };
  }
}
