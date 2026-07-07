import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { ViolenceCategory } from './violence-category.entity';

@Entity('violence_category_translations')
@Unique(['categoryId', 'locale'])
export class ViolenceCategoryTranslation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => ViolenceCategory, (category) => category.translations, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'categoryId' })
  category: ViolenceCategory;

  @Column()
  categoryId: string;

  // Not a hardcoded enum - see spec "Multilingual Support": a new language is
  // just new rows here, no code change.
  @Column()
  locale: string;

  @Column()
  label: string;
}
