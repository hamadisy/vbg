import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/entity/user.entity';
import { FollowUpOutcome } from './enums/follow-up-outcome.enum';
import { Case } from './case.entity';

@Entity('follow_up_entries')
export class FollowUpEntry {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Case, (caseEntity) => caseEntity.followUpEntries, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'caseId' })
  case: Case;

  @Column()
  caseId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'authorId' })
  author: User;

  @Column()
  authorId: string;

  @Column({ type: 'text' })
  comment: string;

  // Qualitative outcome, distinct from Case.status (system workflow stage).
  @Column({ type: 'simple-enum', enum: FollowUpOutcome })
  outcome: FollowUpOutcome;

  @CreateDateColumn()
  createdAt: Date;
}
