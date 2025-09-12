import { Module } from '@nestjs/common';
import { JobsRepository } from '../jobs.repository';
import { JobsRelationalRepository } from './repositories/jobs.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobsEntity } from './entities/jobs.entity';

@Module({
  imports: [TypeOrmModule.forFeature([JobsEntity])],
  providers: [
    {
      provide: JobsRepository,
      useClass: JobsRelationalRepository,
    },
  ],
  exports: [JobsRepository],
})
export class RelationalJobsPersistenceModule {}
