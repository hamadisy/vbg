import { ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Role } from '../../../common/enums/role.enum';
import { AuthenticatedUser } from '../../../common/interfaces/authenticated-request.interface';
import { CASE_REPOSITORY, CaseQueryOptions, ICaseRepository } from '../entity/case.repository.port';
import { VICTIM_REPOSITORY, IVictimRepository } from '../entity/victim.repository.port';
import {
  FOLLOW_UP_ENTRY_REPOSITORY,
  IFollowUpEntryRepository,
} from '../entity/follow-up-entry.repository.port';
import { NotificationsService } from '../../notifications/control/notifications.service';
import { Case } from '../entity/case.entity';
import { CaseStatus } from '../entity/enums/case-status.enum';
import { CreateCaseDto } from '../boundary/dto/create-case.dto';
import { UpdateCaseDto } from '../boundary/dto/update-case.dto';
import { UpdateCaseStatusDto } from '../boundary/dto/update-case-status.dto';
import { CreateFollowUpEntryDto } from '../boundary/dto/create-follow-up-entry.dto';
import { QueryCasesDto } from '../boundary/dto/query-cases.dto';

const RELAY_EDITABLE_STATUSES = [CaseStatus.Acknowledged, CaseStatus.InProcess];

@Injectable()
export class CasesService {
  constructor(
    @Inject(CASE_REPOSITORY) private readonly cases: ICaseRepository,
    @Inject(VICTIM_REPOSITORY) private readonly victims: IVictimRepository,
    @Inject(FOLLOW_UP_ENTRY_REPOSITORY) private readonly followUps: IFollowUpEntryRepository,
    private readonly notifications: NotificationsService,
  ) {}

  async create(dto: CreateCaseDto, currentUser: AuthenticatedUser): Promise<Case> {
    const created = await this.cases.create({
      createdById: currentUser.id,
      regionId: dto.regionId,
      violenceCategoryId: dto.violenceCategoryId,
      incidentAt: new Date(dto.incidentAt),
      description: dto.description,
      measuresTaken: dto.measuresTaken,
      referralStructureId: dto.referralStructureId,
      status: CaseStatus.New,
      victim: { ...dto.victim },
    });
    const fullCase = await this.findOneWithRelations(created.id);
    await this.notifications.notifyNewCase(fullCase);
    return fullCase;
  }

  findAllForUser(query: QueryCasesDto, currentUser: AuthenticatedUser): Promise<Case[]> {
    const options: CaseQueryOptions = {
      status: query.status,
      violenceCategoryId: query.violenceCategoryId,
      search: query.search,
    };
    if (currentUser.role === Role.CommunityRelay) {
      options.ownerId = currentUser.id;
    } else if (currentUser.role === Role.RegionalDirector) {
      options.scopeRegionId = currentUser.regionId ?? undefined;
    } else if (query.regionId) {
      options.filterRegionId = query.regionId;
    }
    return this.cases.findAllScoped(options);
  }

  async findOneWithRelations(id: string): Promise<Case> {
    const found = await this.cases.findByIdWithRelations(id);
    if (!found) {
      throw new NotFoundException('Case not found');
    }
    return found;
  }

  async update(id: string, dto: UpdateCaseDto, currentUser: AuthenticatedUser): Promise<Case> {
    const existing = await this.findOneWithRelations(id);
    if (
      currentUser.role === Role.CommunityRelay &&
      !RELAY_EDITABLE_STATUSES.includes(existing.status)
    ) {
      throw new ForbiddenException('Case is not editable in its current status');
    }

    const { victim, ...caseFields } = dto;
    if (Object.keys(caseFields).length > 0) {
      await this.cases.update(id, caseFields);
    }
    if (victim) {
      await this.victims.update(existing.victim.id, victim);
    }
    return this.findOneWithRelations(id);
  }

  async updateStatus(
    id: string,
    dto: UpdateCaseStatusDto,
    currentUser: AuthenticatedUser,
  ): Promise<Case> {
    const existing = await this.findOneWithRelations(id);
    if (
      currentUser.role === Role.InstitutionalUser &&
      !(existing.status === CaseStatus.New && dto.status === CaseStatus.Acknowledged)
    ) {
      throw new ForbiddenException('Institutional users may only acknowledge new cases');
    }
    return this.cases.update(id, { status: dto.status });
  }

  countOpen(): Promise<number> {
    return this.cases.countOpen();
  }

  async addFollowUp(
    id: string,
    dto: CreateFollowUpEntryDto,
    currentUser: AuthenticatedUser,
  ): Promise<Case> {
    await this.findOneWithRelations(id);
    await this.followUps.create({
      caseId: id,
      authorId: currentUser.id,
      comment: dto.comment,
      outcome: dto.outcome,
    });
    return this.findOneWithRelations(id);
  }
}
