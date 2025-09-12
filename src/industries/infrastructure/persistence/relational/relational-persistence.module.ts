import { Module } from '@nestjs/common';
import { IndustriesRepository } from '../industries.repository';
import { IndustriesRelationalRepository } from './repositories/industries.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IndustriesEntity } from './entities/industries.entity';

@Module({
  imports: [TypeOrmModule.forFeature([IndustriesEntity])],
  providers: [
    {
      provide: IndustriesRepository,
      useClass: IndustriesRelationalRepository,
    },
  ],
  exports: [IndustriesRepository],
})
export class RelationalIndustriesPersistenceModule {}
