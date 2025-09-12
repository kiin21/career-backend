import { Module } from '@nestjs/common';
import { LocationsRepository } from '../locations.repository';
import { locationsRelationalRepository } from './repositories/locations.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocationsEntity } from './entities/locations.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LocationsEntity])],
  providers: [
    {
      provide: LocationsRepository,
      useClass: locationsRelationalRepository,
    },
  ],
  exports: [LocationsRepository],
})
export class RelationallocationsPersistenceModule {}
