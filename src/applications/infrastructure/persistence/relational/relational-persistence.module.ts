import { Module } from '@nestjs/common';
import { ApplicationsRepository } from '../applications.repository';
import { ApplicationsRelationalRepository } from './repositories/applications.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApplicationsEntity } from './entities/applications.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ApplicationsEntity])],
  providers: [
    {
      provide: ApplicationsRepository,
      useClass: ApplicationsRelationalRepository,
    },
  ],
  exports: [ApplicationsRepository],
})
export class RelationalApplicationsPersistenceModule {}
