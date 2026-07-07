import { Body, Controller, Get, Param, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { Roles } from '../../../common/decorators/roles.decorator';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { ScopeByRegion } from '../../../common/decorators/scope-by-region.decorator';
import { ScopeByOwner } from '../../../common/decorators/scope-by-owner.decorator';
import { Audit } from '../../../common/decorators/audit.decorator';
import { Role } from '../../../common/enums/role.enum';
import { AuditAction } from '../../../common/enums/audit-action.enum';
import { AuthenticatedUser } from '../../../common/interfaces/authenticated-request.interface';
import { CASE_REPOSITORY } from '../entity/case.repository.port';
import { Case } from '../entity/case.entity';
import { CasesService } from '../control/cases.service';
import { CreateCaseDto } from './dto/create-case.dto';
import { UpdateCaseDto } from './dto/update-case.dto';
import { UpdateCaseStatusDto } from './dto/update-case-status.dto';
import { CreateFollowUpEntryDto } from './dto/create-follow-up-entry.dto';
import { QueryCasesDto } from './dto/query-cases.dto';
import { CaseResponseDto } from './dto/case-response.dto';

const ALL_CASE_ROLES = [
  Role.CommunityRelay,
  Role.RegionalDirector,
  Role.InstitutionalUser,
  Role.Administrator,
];

@ApiTags('cases')
@ApiBearerAuth()
@Controller('cases')
export class CasesController {
  constructor(private readonly casesService: CasesService) {}

  @Roles(Role.CommunityRelay, Role.Administrator)
  @Audit('Case', AuditAction.Create)
  @Post()
  async create(
    @Body() dto: CreateCaseDto,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<CaseResponseDto> {
    const created = await this.casesService.create(dto, user);
    return this.toResponse(created);
  }

  @Roles(...ALL_CASE_ROLES)
  @Get()
  async findAll(
    @Query() query: QueryCasesDto,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<CaseResponseDto[]> {
    const cases = await this.casesService.findAllForUser(query, user);
    return cases.map((c) => this.toResponse(c));
  }

  // Region/ownership guards both no-op for roles they don't apply to, so a
  // single route can be shared by all four roles.
  @Roles(...ALL_CASE_ROLES)
  @ScopeByRegion(CASE_REPOSITORY)
  @ScopeByOwner(CASE_REPOSITORY)
  @Audit('Case', AuditAction.View)
  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<CaseResponseDto> {
    const found = await this.casesService.findOneWithRelations(id);
    return this.toResponse(found);
  }

  @Roles(Role.CommunityRelay, Role.Administrator)
  @ScopeByOwner(CASE_REPOSITORY)
  @Audit('Case', AuditAction.Update)
  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateCaseDto,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<CaseResponseDto> {
    const updated = await this.casesService.update(id, dto, user);
    return this.toResponse(updated);
  }

  @Roles(Role.RegionalDirector, Role.InstitutionalUser, Role.Administrator)
  @ScopeByRegion(CASE_REPOSITORY)
  @Audit('Case', AuditAction.StatusChange)
  @Patch(':id/status')
  async updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateCaseStatusDto,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<CaseResponseDto> {
    const updated = await this.casesService.updateStatus(id, dto, user);
    return this.toResponse(updated);
  }

  @Roles(Role.RegionalDirector, Role.Administrator)
  @ScopeByRegion(CASE_REPOSITORY)
  @Audit('Case', AuditAction.Update)
  @Post(':id/follow-up')
  async addFollowUp(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: CreateFollowUpEntryDto,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<CaseResponseDto> {
    const updated = await this.casesService.addFollowUp(id, dto, user);
    return this.toResponse(updated);
  }

  private toResponse(entity: Case): CaseResponseDto {
    return plainToInstance(CaseResponseDto, entity, { excludeExtraneousValues: true });
  }
}
