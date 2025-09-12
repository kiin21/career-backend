import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';
import { CompaniesEntity } from '../../../../../companies/infrastructure/persistence/relational/entities/companies.entity';
import { JobCategoriesEntity } from '../../../../../job-categories/infrastructure/persistence/relational/entities/job-categories.entity';
import { LocationsEntity } from '../../../../../locations/infrastructure/persistence/relational/entities/locations.entity';

@Entity({
  name: 'jobs',
})
export class JobsEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @ManyToOne(() => CompaniesEntity)
  @JoinColumn({ name: 'company_id' })
  company: CompaniesEntity;

  @ManyToOne(() => JobCategoriesEntity)
  @JoinColumn({ name: 'category_id' })
  category: JobCategoriesEntity;

  @ManyToOne(() => LocationsEntity)
  @JoinColumn({ name: 'location_id' })
  locationRef: LocationsEntity;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'text', nullable: true })
  requirements: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  location: string | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  employment_type: string | null; // full_time, part_time, internship, contract

  @Column({ type: 'varchar', length: 50, nullable: true })
  experience_level: string | null; // internship, fresher, junior, middle, senior

  @Column({ type: 'decimal', precision: 15, scale: 0, nullable: true })
  salary_min: number | null;

  @Column({ type: 'decimal', precision: 15, scale: 0, nullable: true })
  salary_max: number | null;

  @Column({ type: 'varchar', length: 3, default: 'VND' })
  salary_currency: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  application_method: string | null; // internal, external

  @Column({ type: 'varchar', length: 500, nullable: true })
  application_url: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  application_email: string | null;

  @Column({ type: 'bigint', default: 0 })
  apply_count: number;

  @Column({ type: 'timestamp', nullable: true })
  deadline: Date | null;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
