import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Region } from '../../regions/entity/region.entity';
import { ViolenceCategory } from '../../violence-categories/entity/violence-category.entity';

@Entity('notification_recipients')
export class NotificationRecipient {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  phone: string;

  // Null = all regions.
  @ManyToOne(() => Region, { nullable: true })
  @JoinColumn({ name: 'regionId' })
  region?: Region | null;

  @Column({ nullable: true })
  regionId?: string | null;

  // Null = all violence categories.
  @ManyToOne(() => ViolenceCategory, { nullable: true })
  @JoinColumn({ name: 'violenceCategoryId' })
  violenceCategory?: ViolenceCategory | null;

  @Column({ nullable: true })
  violenceCategoryId?: string | null;

  @Column({ default: true })
  isActive: boolean;
}
