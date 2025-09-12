import { Module } from '@nestjs/common';
import { CompaniesRepository } from '../companies.repository';
import { CompaniesRelationalRepository } from './repositories/companies.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompaniesEntity } from './entities/companies.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CompaniesEntity])],
  providers: [
    {
      provide: CompaniesRepository,
      useClass: CompaniesRelationalRepository,
    },
  ],
  exports: [CompaniesRepository],
})
export class RelationalcompaniesPersistenceModule {}
