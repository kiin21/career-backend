import { Module } from '@nestjs/common';
import { JobCategoriesRepository } from '../job-categories.repository';
import { JobCategoriesRelationalRepository } from './repositories/job-categories.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobCategoriesEntity } from './entities/job-categories.entity';

@Module({
  imports: [TypeOrmModule.forFeature([JobCategoriesEntity])],
  providers: [
    {
      provide: JobCategoriesRepository,
      useClass: JobCategoriesRelationalRepository,
    },
  ],
  exports: [JobCategoriesRepository],
})
export class RelationalJobCategoriesPersistenceModule {}
