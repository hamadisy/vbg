import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ViolenceCategory } from './violence-category.entity';
import { ViolenceCategoryTranslation } from './violence-category-translation.entity';
import { TypeOrmBaseRepository } from '../../../common/base/base-typeorm.repository';
import {
  IViolenceCategoryRepository,
  UpdateViolenceCategoryInput,
} from './violence-category.repository.port';

// Only file in this module allowed to import from 'typeorm'.
@Injectable()
export class ViolenceCategoryTypeOrmRepository
  extends TypeOrmBaseRepository<ViolenceCategory>
  implements IViolenceCategoryRepository
{
  constructor(@InjectRepository(ViolenceCategory) repo: Repository<ViolenceCategory>) {
    super(repo);
  }

  // Overrides the base (relation-free) findById - no guard depends on this
  // token, and master data is small enough to always eager-load translations.
  findById(id: string): Promise<ViolenceCategory | null> {
    return this.repo.findOne({ where: { id }, relations: { translations: true } });
  }

  findByCode(code: string): Promise<ViolenceCategory | null> {
    return this.repo.findOne({ where: { code }, relations: { translations: true } });
  }

  findAllFiltered(includeInactive: boolean): Promise<ViolenceCategory[]> {
    return this.repo.find({
      where: includeInactive ? {} : { isActive: true },
      relations: { translations: true },
      order: { sortOrder: 'ASC' },
    });
  }

  async update(id: string, data: UpdateViolenceCategoryInput): Promise<ViolenceCategory> {
    const existing = await this.repo.findOneBy({ id });
    if (!existing) {
      throw new NotFoundException('Violence category not found');
    }
    if (data.code !== undefined) existing.code = data.code;
    if (data.isActive !== undefined) existing.isActive = data.isActive;
    if (data.sortOrder !== undefined) existing.sortOrder = data.sortOrder;

    await this.repo.manager.transaction(async (manager) => {
      await manager.save(ViolenceCategory, existing);
      if (data.translations) {
        // Delete-then-insert (not a same-save cascade replace): assigning a
        // fresh array via orphanedRowAction can INSERT the new rows before
        // DELETEing the old ones in the same persist, tripping the
        // (categoryId, locale) unique constraint when a locale repeats.
        await manager.delete(ViolenceCategoryTranslation, { categoryId: id });
        await manager.save(
          ViolenceCategoryTranslation,
          data.translations.map((t) =>
            manager.create(ViolenceCategoryTranslation, {
              categoryId: id,
              locale: t.locale,
              label: t.label,
            }),
          ),
        );
      }
    });

    const updated = await this.findById(id);
    if (!updated) {
      throw new Error(`Violence category ${id} not found after update`);
    }
    return updated;
  }
}
