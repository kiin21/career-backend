import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';
import { JobsEntity } from '../../../../../jobs/infrastructure/persistence/relational/entities/jobs.entity';
import { UserEntity } from '../../../../../users/infrastructure/persistence/relational/entities/user.entity';

@Entity({
  name: 'applications',
})
@Index(['job_id', 'user_id'], { unique: true })
export class ApplicationsEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @ManyToOne(() => JobsEntity)
  @JoinColumn({ name: 'job_id' })
  job: JobsEntity;

  @Column({ type: 'bigint' })
  job_id: number;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column({ type: 'bigint' })
  user_id: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  status: string | null; // applied, reviewed, interview, offer, rejected

  @Column({ type: 'varchar', length: 500, nullable: true })
  resume_url: string | null;

  @Column({ type: 'varchar', length: 500, nullable: true })
  cover_url: string | null;

  @Column({ type: 'jsonb', nullable: true })
  responses: any;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
