import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/entity/user.entity';
import { AuditAction } from '../../../common/enums/audit-action.enum';

@Entity('audit_logs')
export class AuditLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: string;

  @Column({ type: 'simple-enum', enum: AuditAction })
  action: AuditAction;

  @Column()
  entityType: string;

  @Column()
  entityId: string;

  @Column({ type: 'text', nullable: true })
  details?: string;

  @CreateDateColumn()
  timestamp: Date;
}
