import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { AgeRange } from './enums/age-range.enum';
import { Sex } from './enums/sex.enum';
import { RelationshipToPerpetrator } from './enums/relationship-to-perpetrator.enum';
import { SafetyRisk } from './enums/safety-risk.enum';
import { Case } from './case.entity';

@Entity('victims')
export class Victim {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => Case, (caseEntity) => caseEntity.victim, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'caseId' })
  case: Case;

  @Column()
  caseId: string;

  // Identity kept minimal to protect the survivor - no full legal name by default.
  @Column({ nullable: true })
  alias?: string;

  @Column({ type: 'simple-enum', enum: AgeRange })
  ageRange: AgeRange;

  @Column({ type: 'simple-enum', enum: Sex })
  sex: Sex;

  @Column({ nullable: true })
  contactPhone?: string;

  @Column({ type: 'simple-enum', enum: RelationshipToPerpetrator })
  relationshipToPerpetrator: RelationshipToPerpetrator;

  @Column()
  perpetratorKnown: boolean;

  @Column()
  cohabitingWithPerpetrator: boolean;

  // Deliberate simplification over a join table - acceptable at this scale
  // (<=500 users, ~20 cases/day) but not individually indexable/queryable.
  @Column({ type: 'simple-array', nullable: true })
  vulnerabilityFactors?: string[];

  @Column({ type: 'simple-enum', enum: SafetyRisk })
  safetyRisk: SafetyRisk;
}
