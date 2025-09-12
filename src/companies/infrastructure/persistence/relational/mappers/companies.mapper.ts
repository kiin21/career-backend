import { Companies } from '../../../../domain/companies';
import { CompaniesEntity } from '../entities/companies.entity';

export class CompaniesMapper {
  static toDomain(raw: CompaniesEntity): Companies {
    const domainEntity = new Companies();
    domainEntity.id = raw.id;
    domainEntity.name = raw.name;
    domainEntity.logo_url = raw.logo_url;

    return domainEntity;
  }

  static toPersistence(domainEntity: Companies): CompaniesEntity {
    const persistenceEntity = new CompaniesEntity();
    if (domainEntity.id) {
      persistenceEntity.id = Number(domainEntity.id);
    }
    persistenceEntity.name = domainEntity.name;
    persistenceEntity.logo_url = domainEntity.logo_url;

    return persistenceEntity;
  }
}
