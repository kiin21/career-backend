import { Applications } from '../../../../domain/applications';
import { ApplicationsEntity } from '../entities/applications.entity';

export class ApplicationsMapper {
  static toDomain(raw: ApplicationsEntity): Applications {
    const domainEntity = new Applications();
    domainEntity.id = raw.id;
    domainEntity.created_at = raw.created_at;
    domainEntity.updated_at = raw.updated_at;

    return domainEntity;
  }

  static toPersistence(domainEntity: Applications): ApplicationsEntity {
    const persistenceEntity = new ApplicationsEntity();
    if (domainEntity.id) {
      persistenceEntity.id = Number(domainEntity.id);
    }
    persistenceEntity.created_at = domainEntity.created_at;
    persistenceEntity.updated_at = domainEntity.updated_at;

    return persistenceEntity;
  }
}
