import { Module } from '@nestjs/common';
import { JobSkillsRepository } from '../job-skills.repository';
import { JobSkillsRelationalRepository } from './repositories/job-skills.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobSkillsEntity } from './entities/job-skills.entity';

@Module({
  imports: [TypeOrmModule.forFeature([JobSkillsEntity])],
  providers: [
    {
      provide: JobSkillsRepository,
      useClass: JobSkillsRelationalRepository,
    },
  ],
  exports: [JobSkillsRepository],
})
export class RelationalJobSkillsPersistenceModule {}
