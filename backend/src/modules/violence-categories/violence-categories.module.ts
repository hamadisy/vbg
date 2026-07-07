import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ViolenceCategory } from './entity/violence-category.entity';
import { ViolenceCategoryTranslation } from './entity/violence-category-translation.entity';
import { VIOLENCE_CATEGORY_REPOSITORY } from './entity/violence-category.repository.port';
import { ViolenceCategoryTypeOrmRepository } from './entity/violence-category.repository.adapter';
import { ViolenceCategoriesController } from './boundary/violence-categories.controller';
import { ViolenceCategoriesService } from './control/violence-categories.service';

@Module({
  imports: [TypeOrmModule.forFeature([ViolenceCategory, ViolenceCategoryTranslation])],
  controllers: [ViolenceCategoriesController],
  providers: [
    ViolenceCategoriesService,
    { provide: VIOLENCE_CATEGORY_REPOSITORY, useClass: ViolenceCategoryTypeOrmRepository },
  ],
  exports: [VIOLENCE_CATEGORY_REPOSITORY],
})
export class ViolenceCategoriesModule {}
