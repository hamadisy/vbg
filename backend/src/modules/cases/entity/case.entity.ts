import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entity/user.entity';
import { Region } from '../../regions/entity/region.entity';
import { ViolenceCategory } from '../../violence-categories/entity/violence-category.entity';
import { ReferralStructure } from '../../referral-structures/entity/referral-structure.entity';
import { CaseStatus } from './enums/case-status.enum';
import { Victim } from './victim.entity';
import { FollowUpEntry } from './follow-up-entry.entity';

@Entity('cases')
export class Case {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'createdById' })
  createdBy: User;

  @Column()
  createdById: string;

  // Real FK (not free text) - RegionScopeGuard compares this directly against
  // the Regional Director's own regionId, so it must stay a first-class column.
  @ManyToOne(() => Region)
  @JoinColumn({ name: 'regionId' })
  region: Region;

  @Column()
  regionId: string;

  @ManyToOne(() => ViolenceCategory)
  @JoinColumn({ name: 'violenceCategoryId' })
  violenceCategory: ViolenceCategory;

  @Column()
  violenceCategoryId: string;

  // When the violence occurred, distinct from createdAt (when it was
  // reported) - a relay may report a case some time after the fact.
  // Nullable so existing rows don't need a backfill; required going forward
  // at the CreateCaseDto validation layer.
  @Column({ type: 'datetime', nullable: true })
  incidentAt?: Date | null;

  @Column({ type: 'text' })
  description: string;

  @OneToOne(() => Victim, (victim) => victim.case, { cascade: true })
  victim: Victim;

  @Column({ type: 'text', nullable: true })
  measuresTaken?: string;

  @ManyToOne(() => ReferralStructure)
  @JoinColumn({ name: 'referralStructureId' })
  referralStructure: ReferralStructure;

  @Column()
  referralStructureId: string;

  @Column({ type: 'simple-enum', enum: CaseStatus, default: CaseStatus.New })
  status: CaseStatus;

  @OneToMany(() => FollowUpEntry, (entry) => entry.case)
  followUpEntries: FollowUpEntry[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
