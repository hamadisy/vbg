import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/entity/user.entity';

@Entity('password_reset_tokens')
export class PasswordResetToken {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: string;

  // Hash of the raw token - the raw value is only ever emailed, never stored.
  @Column()
  tokenHash: string;

  @Column()
  expiresAt: Date;

  @Column({ type: 'datetime', nullable: true })
  usedAt?: Date | null;

  @CreateDateColumn()
  createdAt: Date;
}
