import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { IndustriesSeedService } from './industries-seed.service';
import { IndustriesEntity } from '../../../../industries/infrastructure/persistence/relational/entities/industries.entity';

@Module({
  imports: [TypeOrmModule.forFeature([IndustriesEntity])],
  providers: [IndustriesSeedService],
  exports: [IndustriesSeedService],
})
export class IndustriesSeedModule {}
