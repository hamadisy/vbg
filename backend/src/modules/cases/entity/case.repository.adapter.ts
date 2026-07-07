import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, FindOptionsWhere, Like, Not, Repository, SelectQueryBuilder } from 'typeorm';
import { Case } from './case.entity';
import { CaseStatus } from './enums/case-status.enum';
import { TypeOrmBaseRepository } from '../../../common/base/base-typeorm.repository';
import {
  CaseQueryOptions,
  CaseStatsScope,
  ICaseRepository,
  RegionCaseCount,
  RegionViolenceCategoryCaseCount,
  ViolenceCategoryCaseCount,
} from './case.repository.port';

const CASE_RELATIONS = {
  createdBy: true,
  region: true,
  violenceCategory: true,
  victim: true,
  referralStructure: true,
  followUpEntries: { author: true },
} as const;

// Only file in this module allowed to import from 'typeorm'.
@Injectable()
export class CaseTypeOrmRepository extends TypeOrmBaseRepository<Case> implements ICaseRepository {
  constructor(@InjectRepository(Case) repo: Repository<Case>) {
    super(repo);
  }

  findByIdWithRelations(id: string): Promise<Case | null> {
    return this.repo.findOne({ where: { id }, relations: CASE_RELATIONS });
  }

  findAllScoped(options: CaseQueryOptions): Promise<Case[]> {
    const where: FindOptionsWhere<Case> = {};
    if (options.ownerId) where.createdById = options.ownerId;
    if (options.scopeRegionId) where.regionId = options.scopeRegionId;
    if (options.filterRegionId) where.regionId = options.filterRegionId;
    if (options.status) where.status = options.status;
    if (options.violenceCategoryId) where.violenceCategoryId = options.violenceCategoryId;
    if (options.search) where.description = Like(`%${options.search}%`);

    return this.repo.find({
      where,
      relations: CASE_RELATIONS,
      order: { createdAt: 'DESC' },
    });
  }

  async update(id: string, data: DeepPartial<Case>): Promise<Case> {
    await this.repo.update(id, data);
    const updated = await this.findByIdWithRelations(id);
    if (!updated) {
      throw new Error(`Case ${id} not found after update`);
    }
    return updated;
  }

  countTotal(scope: CaseStatsScope): Promise<number> {
    const qb = this.repo.createQueryBuilder('case');
    this.applyScope(qb, scope);
    return qb.getCount();
  }

  countOpen(): Promise<number> {
    return this.repo.count({ where: { status: Not(CaseStatus.Closed) } });
  }

  async countByRegion(scope: CaseStatsScope): Promise<RegionCaseCount[]> {
    const qb = this.repo
      .createQueryBuilder('case')
      .innerJoin('case.region', 'region')
      .select('region.id', 'regionId')
      .addSelect('region.name', 'regionName')
      .addSelect('COUNT(case.id)', 'count')
      .groupBy('region.id')
      .addGroupBy('region.name');
    this.applyScope(qb, scope);

    const rows = await qb.getRawMany<{ regionId: string; regionName: string; count: string }>();
    return rows.map((row) => ({
      regionId: row.regionId,
      regionName: row.regionName,
      count: parseInt(row.count, 10),
    }));
  }

  async countByViolenceCategory(scope: CaseStatsScope): Promise<ViolenceCategoryCaseCount[]> {
    const qb = this.repo
      .createQueryBuilder('case')
      .innerJoin('case.violenceCategory', 'category')
      .select('category.id', 'violenceCategoryId')
      .addSelect('category.code', 'code')
      .addSelect('COUNT(case.id)', 'count')
      .groupBy('category.id')
      .addGroupBy('category.code');
    this.applyScope(qb, scope);

    const rows = await qb.getRawMany<{
      violenceCategoryId: string;
      code: string;
      count: string;
    }>();
    return rows.map((row) => ({
      violenceCategoryId: row.violenceCategoryId,
      code: row.code,
      count: parseInt(row.count, 10),
    }));
  }

  async countByRegionAndCategory(
    scope: CaseStatsScope,
  ): Promise<RegionViolenceCategoryCaseCount[]> {
    const qb = this.repo
      .createQueryBuilder('case')
      .innerJoin('case.region', 'region')
      .innerJoin('case.violenceCategory', 'category')
      .select('region.id', 'regionId')
      .addSelect('region.name', 'regionName')
      .addSelect('category.id', 'violenceCategoryId')
      .addSelect('category.code', 'code')
      .addSelect('COUNT(case.id)', 'count')
      .groupBy('region.id')
      .addGroupBy('region.name')
      .addGroupBy('category.id')
      .addGroupBy('category.code');
    this.applyScope(qb, scope);

    const rows = await qb.getRawMany<{
      regionId: string;
      regionName: string;
      violenceCategoryId: string;
      code: string;
      count: string;
    }>();
    return rows.map((row) => ({
      regionId: row.regionId,
      regionName: row.regionName,
      violenceCategoryId: row.violenceCategoryId,
      code: row.code,
      count: parseInt(row.count, 10),
    }));
  }

  private applyScope(qb: SelectQueryBuilder<Case>, scope: CaseStatsScope): void {
    if (scope.regionId) {
      qb.andWhere('case.regionId = :regionId', { regionId: scope.regionId });
    }
    if (scope.ownerId) {
      qb.andWhere('case.createdById = :ownerId', { ownerId: scope.ownerId });
    }
  }
}
