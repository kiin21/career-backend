import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { JobSkillsSeedService } from './job-skills-seed.service';
import { JobSkillsEntity } from '../../../../job-skills/infrastructure/persistence/relational/entities/job-skills.entity';
import { JobsEntity } from '../../../../jobs/infrastructure/persistence/relational/entities/jobs.entity';

@Module({
  imports: [TypeOrmModule.forFeature([JobSkillsEntity, JobsEntity])],
  providers: [JobSkillsSeedService],
  exports: [JobSkillsSeedService],
})
export class JobSkillsSeedModule {}
