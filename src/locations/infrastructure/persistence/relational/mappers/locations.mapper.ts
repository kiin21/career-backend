import { Locations } from '../../../../domain/locations';
import { LocationsEntity } from '../entities/locations.entity';

export class LocationsMapper {
  static toDomain(raw: LocationsEntity): Locations {
    const domainEntity = new Locations();
    domainEntity.id = raw.id;
    domainEntity.name = raw.name;

    return domainEntity;
  }

  static toPersistence(domainEntity: Locations): LocationsEntity {
    const persistenceEntity = new LocationsEntity();
    if (domainEntity.id) {
      persistenceEntity.id = Number(domainEntity.id);
    }
    persistenceEntity.name = domainEntity.name;

    return persistenceEntity;
  }
}
