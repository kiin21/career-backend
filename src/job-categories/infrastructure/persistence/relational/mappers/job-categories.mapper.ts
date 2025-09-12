import { JobCategories } from '../../../../domain/job-categories';
import { JobCategoriesEntity } from '../entities/job-categories.entity';

export class JobCategoriesMapper {
  static toDomain(raw: JobCategoriesEntity): JobCategories {
    const domainEntity = new JobCategories();
    domainEntity.id = raw.id;
    domainEntity.name = raw.name;
    domainEntity.description = raw.description;

    return domainEntity;
  }

  static toPersistence(domainEntity: JobCategories): JobCategoriesEntity {
    const persistenceEntity = new JobCategoriesEntity();
    if (domainEntity.id) {
      persistenceEntity.id = Number(domainEntity.id);
    }
    persistenceEntity.name = domainEntity.name;
    persistenceEntity.description = domainEntity.description ?? null;

    return persistenceEntity;
  }
}
