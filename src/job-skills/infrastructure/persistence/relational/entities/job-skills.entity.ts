import { Column, Entity, ManyToOne, PrimaryColumn, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';
import { JobsEntity } from '../../../../../jobs/infrastructure/persistence/relational/entities/jobs.entity';

@Entity({
  name: 'job_skills',
})
export class JobSkillsEntity extends EntityRelationalHelper {
  @PrimaryColumn({ type: 'bigint' })
  @ManyToOne(() => JobsEntity)
  @JoinColumn({ name: 'job_id' })
  job_id: number;

  @PrimaryColumn({ type: 'varchar', length: 100 })
  skill_name: string;

  @Column({ type: 'boolean', default: false })
  is_required: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
