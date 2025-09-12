import { Companies } from '../../../../domain/companies';
import { CompaniesEntity } from '../entities/companies.entity';

export class companiesMapper {
  static toDomain(raw: CompaniesEntity): Companies {
    const domainEntity = new Companies();
    domainEntity.id = raw.id;
    domainEntity.name = raw.name;

    return domainEntity;
  }

  static toPersistence(domainEntity: Companies): CompaniesEntity {
    const persistenceEntity = new CompaniesEntity();
    if (domainEntity.id) {
      persistenceEntity.id = Number(domainEntity.id);
    }
    persistenceEntity.name = domainEntity.name;

    return persistenceEntity;
  }
}
