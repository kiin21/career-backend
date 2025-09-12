import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ApplicationsSeedService } from './applications-seed.service';
import { ApplicationsEntity } from '../../../../applications/infrastructure/persistence/relational/entities/applications.entity';
import { JobsEntity } from '../../../../jobs/infrastructure/persistence/relational/entities/jobs.entity';
import { UserEntity } from '../../../../users/infrastructure/persistence/relational/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ApplicationsEntity, JobsEntity, UserEntity])],
  providers: [ApplicationsSeedService],
  exports: [ApplicationsSeedService],
})
export class ApplicationsSeedModule {}
