import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('regions')
export class Region {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  municipality: string;

  @Column({ nullable: true })
  village?: string;

  // Soft-deactivate rather than delete - Users/Cases hold a hard FK to a region.
  @Column({ default: true })
  isActive: boolean;
}
