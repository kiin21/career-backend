import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CompaniesSeedService } from './companies-seed.service';
import { CompaniesEntity } from '../../../../companies/infrastructure/persistence/relational/entities/companies.entity';
import { IndustriesEntity } from '../../../../industries/infrastructure/persistence/relational/entities/industries.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CompaniesEntity, IndustriesEntity])],
  providers: [CompaniesSeedService],
  exports: [CompaniesSeedService],
})
export class CompaniesSeedModule {}
