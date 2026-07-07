import { ICrudRepository } from '../../../common/base/base-repository.port';
import { ViolenceCategory } from './violence-category.entity';

export const VIOLENCE_CATEGORY_REPOSITORY = Symbol('VIOLENCE_CATEGORY_REPOSITORY');

export interface TranslationInput {
  locale: string;
  label: string;
}

export interface UpdateViolenceCategoryInput {
  code?: string;
  isActive?: boolean;
  sortOrder?: number;
  // Replace-all: when present, fully replaces the existing translation set.
  translations?: TranslationInput[];
}

export interface IViolenceCategoryRepository extends ICrudRepository<ViolenceCategory> {
  findByCode(code: string): Promise<ViolenceCategory | null>;
  findAllFiltered(includeInactive: boolean): Promise<ViolenceCategory[]>;
  update(id: string, data: UpdateViolenceCategoryInput): Promise<ViolenceCategory>;
}
