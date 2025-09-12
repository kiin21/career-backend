import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LocationsEntity } from '../../../../locations/infrastructure/persistence/relational/entities/locations.entity';

@Injectable()
export class LocationsSeedService {
  constructor(
    @InjectRepository(LocationsEntity)
    private repository: Repository<LocationsEntity>,
  ) { }

  async run() {
    const count = await this.repository.count();

    if (!count) {
      const locations = [{ name: 'Onsite' }, { name: 'Remote' }, { name: 'Hybrid' }];

      for (const location of locations) {
        await this.repository.save(this.repository.create(location));
      }
    }
  }
}
