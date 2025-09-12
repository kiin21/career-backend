import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { JobsSeedService } from './jobs-seed.service';
import { JobsEntity } from '../../../../jobs/infrastructure/persistence/relational/entities/jobs.entity';
import { CompaniesEntity } from '../../../../companies/infrastructure/persistence/relational/entities/companies.entity';
import { JobCategoriesEntity } from '../../../../job-categories/infrastructure/persistence/relational/entities/job-categories.entity';
import { LocationsEntity } from '../../../../locations/infrastructure/persistence/relational/entities/locations.entity';

@Module({
  imports: [TypeOrmModule.forFeature([JobsEntity, CompaniesEntity, JobCategoriesEntity, LocationsEntity])],
  providers: [JobsSeedService],
  exports: [JobsSeedService],
})
export class JobsSeedModule {}
