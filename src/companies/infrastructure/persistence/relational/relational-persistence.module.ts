import { Module } from '@nestjs/common';
import { companiesRepository } from '../companies.repository';
import { companiesRelationalRepository } from './repositories/companies.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompaniesEntity } from './entities/companies.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CompaniesEntity])],
  providers: [
    {
      provide: companiesRepository,
      useClass: companiesRelationalRepository,
    },
  ],
  exports: [companiesRepository],
})
export class RelationalcompaniesPersistenceModule {}
