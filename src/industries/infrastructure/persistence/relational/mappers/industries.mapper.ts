import { Industries } from '../../../../domain/industries';
import { IndustriesEntity } from '../entities/industries.entity';

export class IndustriesMapper {
  static toDomain(raw: IndustriesEntity): Industries {
    const domainEntity = new Industries();
    domainEntity.id = raw.id;
    domainEntity.created_at = raw.created_at;
    domainEntity.updated_at = raw.updated_at;

    return domainEntity;
  }

  static toPersistence(domainEntity: Industries): IndustriesEntity {
    const persistenceEntity = new IndustriesEntity();
    if (domainEntity.id) {
      persistenceEntity.id = Number(domainEntity.id);
    }
    persistenceEntity.created_at = domainEntity.created_at;
    persistenceEntity.updated_at = domainEntity.updated_at;

    return persistenceEntity;
  }
}
