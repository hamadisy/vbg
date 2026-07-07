import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ViolenceCategoryTranslation } from './violence-category-translation.entity';

@Entity('violence_categories')
export class ViolenceCategory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Stable machine key (e.g. 'PHYSICAL', 'FGM', 'OTHER') - FK target from Case.
  // Display label always comes from ViolenceCategoryTranslation, never this field.
  @Column({ unique: true })
  code: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: 0 })
  sortOrder: number;

  // cascade: true only backs create() (nested translations inserted alongside
  // the parent). Replace-all on update() is handled by an explicit
  // delete-then-insert in the repository adapter, not by orphan removal here -
  // relying on cascade for that raced INSERTs before DELETEs and tripped the
  // (categoryId, locale) unique constraint.
  @OneToMany(() => ViolenceCategoryTranslation, (translation) => translation.category, {
    cascade: true,
  })
  translations: ViolenceCategoryTranslation[];
}
