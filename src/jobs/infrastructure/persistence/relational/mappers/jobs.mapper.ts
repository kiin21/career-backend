import { Jobs } from '../../../../domain/jobs';
import { JobsEntity } from '../entities/jobs.entity';
import { companiesMapper } from '../../../../../companies/infrastructure/persistence/relational/mappers/companies.mapper';
import { JobCategoriesMapper } from '../../../../../job-categories/infrastructure/persistence/relational/mappers/job-categories.mapper';
import { LocationsMapper } from '../../../../../locations/infrastructure/persistence/relational/mappers/locations.mapper';

export class JobsMapper {
  static toDomain(raw: JobsEntity): Jobs {
    const domainEntity = new Jobs();
    domainEntity.id = Number(raw.id);
    domainEntity.title = raw.title;
    domainEntity.description = raw.description;
    domainEntity.requirements = raw.requirements;
    domainEntity.location = raw.location;
    domainEntity.employment_type = raw.employment_type;
    domainEntity.experience_level = raw.experience_level;
    domainEntity.salary_min = raw.salary_min ? Number(raw.salary_min) : null;
    domainEntity.salary_max = raw.salary_max ? Number(raw.salary_max) : null;
    domainEntity.salary_currency = raw.salary_currency;
    domainEntity.application_method = raw.application_method;
    domainEntity.application_url = raw.application_url;
    domainEntity.application_email = raw.application_email;
    domainEntity.apply_count = Number(raw.apply_count);
    domainEntity.deadline = raw.deadline;
    domainEntity.is_active = raw.is_active;

    if (raw.company) {
      domainEntity.company = companiesMapper.toDomain(raw.company);
    }

    if (raw.category) {
      domainEntity.category = JobCategoriesMapper.toDomain(raw.category);
    }

    if (raw.locationRef) {
      domainEntity.location_ref = LocationsMapper.toDomain(raw.locationRef);
    }

    domainEntity.created_at = raw.created_at;
    domainEntity.updated_at = raw.updated_at;

    return domainEntity;
  }

  static toPersistence(domainEntity: Jobs): JobsEntity {
    const persistenceEntity = new JobsEntity();

    if (domainEntity.id) {
      persistenceEntity.id = Number(domainEntity.id);
    }

    persistenceEntity.title = domainEntity.title;
    persistenceEntity.description = domainEntity.description ?? null;
    persistenceEntity.requirements = domainEntity.requirements ?? null;
    persistenceEntity.location = domainEntity.location ?? null;
    persistenceEntity.employment_type = domainEntity.employment_type ?? null;
    persistenceEntity.experience_level = domainEntity.experience_level ?? null;
    persistenceEntity.salary_min = domainEntity.salary_min ?? null;
    persistenceEntity.salary_max = domainEntity.salary_max ?? null;
    persistenceEntity.salary_currency = domainEntity.salary_currency || 'VND';
    persistenceEntity.application_method =
      domainEntity.application_method ?? null;
    persistenceEntity.application_url = domainEntity.application_url ?? null;
    persistenceEntity.application_email =
      domainEntity.application_email ?? null;
    persistenceEntity.apply_count = domainEntity.apply_count || 0;
    persistenceEntity.deadline = domainEntity.deadline ?? null;
    persistenceEntity.is_active = domainEntity.is_active ?? true;

    if (domainEntity.company) {
      persistenceEntity.company = companiesMapper.toPersistence(
        domainEntity.company,
      );
    }

    if (domainEntity.category) {
      persistenceEntity.category = JobCategoriesMapper.toPersistence(
        domainEntity.category,
      );
    }

    if (domainEntity.location_ref) {
      persistenceEntity.locationRef = LocationsMapper.toPersistence(
        domainEntity.location_ref,
      );
    }

    persistenceEntity.created_at = domainEntity.created_at;

    return persistenceEntity;
  }
}
