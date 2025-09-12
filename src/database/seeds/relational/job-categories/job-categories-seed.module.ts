import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { JobCategoriesSeedService } from './job-categories-seed.service';
import { JobCategoriesEntity } from '../../../../job-categories/infrastructure/persistence/relational/entities/job-categories.entity';

@Module({
  imports: [TypeOrmModule.forFeature([JobCategoriesEntity])],
  providers: [JobCategoriesSeedService],
  exports: [JobCategoriesSeedService],
})
export class JobCategoriesSeedModule {}
