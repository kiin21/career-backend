import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LocationsSeedService } from './locations-seed.service';
import { LocationsEntity } from '../../../../locations/infrastructure/persistence/relational/entities/locations.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LocationsEntity])],
  providers: [LocationsSeedService],
  exports: [LocationsSeedService],
})
export class LocationsSeedModule {}
