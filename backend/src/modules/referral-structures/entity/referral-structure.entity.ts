import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Region } from '../../regions/entity/region.entity';
import { ReferralStructureType } from './enums/referral-structure-type.enum';
import { ReferralStructureTranslation } from './referral-structure-translation.entity';

@Entity('referral_structures')
export class ReferralStructure {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'simple-enum', enum: ReferralStructureType })
  type: ReferralStructureType;

  // Specific named organization/contact, e.g. "MASEF - Regional Representative",
  // "Medicus Mundi", "CSVVDH Regional Social Worker" - per spec Referral Structures.
  @Column()
  name: string;

  @ManyToOne(() => Region)
  @JoinColumn({ name: 'regionId' })
  region: Region;

  @Column()
  regionId: string;

  @Column({ nullable: true })
  contactPhone?: string;

  @Column({ nullable: true })
  contactEmail?: string;

  // Soft-deactivate rather than delete - Cases hold a hard FK to a referral structure.
  @Column({ default: true })
  isActive: boolean;

  // cascade: true only backs create() (nested translations inserted alongside
  // the parent). Replace-all on update() is handled by an explicit
  // delete-then-insert in the repository adapter, not by orphan removal here -
  // relying on cascade for that raced INSERTs before DELETEs and tripped the
  // (referralStructureId, locale) unique constraint.
  @OneToMany(() => ReferralStructureTranslation, (translation) => translation.referralStructure, {
    cascade: true,
  })
  translations: ReferralStructureTranslation[];
}
