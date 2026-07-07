import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  IViolenceCategoryRepository,
  VIOLENCE_CATEGORY_REPOSITORY,
} from '../entity/violence-category.repository.port';
import { ViolenceCategory } from '../entity/violence-category.entity';
import { CreateViolenceCategoryDto } from '../boundary/dto/create-violence-category.dto';
import { UpdateViolenceCategoryDto } from '../boundary/dto/update-violence-category.dto';

@Injectable()
export class ViolenceCategoriesService {
  constructor(
    @Inject(VIOLENCE_CATEGORY_REPOSITORY)
    private readonly categories: IViolenceCategoryRepository,
  ) {}

  async create(dto: CreateViolenceCategoryDto): Promise<ViolenceCategory> {
    const existing = await this.categories.findByCode(dto.code);
    if (existing) {
      throw new ConflictException('A violence category with this code already exists');
    }
    return this.categories.create(dto);
  }

  findAll(includeInactive: boolean): Promise<ViolenceCategory[]> {
    return this.categories.findAllFiltered(includeInactive);
  }

  async findById(id: string): Promise<ViolenceCategory> {
    const category = await this.categories.findById(id);
    if (!category) {
      throw new NotFoundException('Violence category not found');
    }
    return category;
  }

  async update(id: string, dto: UpdateViolenceCategoryDto): Promise<ViolenceCategory> {
    await this.findById(id);
    return this.categories.update(id, dto);
  }

  async deactivate(id: string): Promise<void> {
    await this.findById(id);
    await this.categories.update(id, { isActive: false });
  }
}
