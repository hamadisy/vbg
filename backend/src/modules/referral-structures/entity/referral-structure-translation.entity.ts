import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { ReferralStructure } from './referral-structure.entity';

@Entity('referral_structure_translations')
@Unique(['referralStructureId', 'locale'])
export class ReferralStructureTranslation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => ReferralStructure, (structure) => structure.translations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'referralStructureId' })
  referralStructure: ReferralStructure;

  @Column()
  referralStructureId: string;

  @Column()
  locale: string;

  @Column()
  label: string;
}
