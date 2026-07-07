import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Role } from '../../../common/enums/role.enum';
import { Region } from '../../regions/entity/region.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  fullName: string;

  @Index({ unique: true })
  @Column()
  username: string;

  @Column()
  passwordHash: string;

  @Column({ nullable: true })
  phone?: string;

  @Index({ unique: true })
  @Column({ nullable: true })
  email?: string;

  @Column({ type: 'simple-enum', enum: Role })
  role: Role;

  // Nullable: Administrator/Institutional User are not region-scoped.
  @ManyToOne(() => Region, { nullable: true })
  @JoinColumn({ name: 'regionId' })
  region?: Region | null;

  @Column({ nullable: true })
  regionId?: string | null;

  @Column({ default: 'fr' })
  language: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date | null;
}
