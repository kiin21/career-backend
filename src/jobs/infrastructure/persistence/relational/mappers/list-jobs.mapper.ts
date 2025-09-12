import { JobsEntity } from '../entities/jobs.entity';
import { companiesMapper } from '../../../../../companies/infrastructure/persistence/relational/mappers/companies.mapper';
import { ListJobsResponse } from '../../../../domain/list-jobs-response';

export class ListJobsMapper {
  static toDomain(raw: JobsEntity): ListJobsResponse {
    const domainEntity = new ListJobsResponse();
    domainEntity.id = Number(raw.id);
    domainEntity.title = raw.title;
    domainEntity.location = raw.location;
    domainEntity.employment_type = raw.employment_type;
    domainEntity.experience_level = raw.experience_level;
    domainEntity.deadline = raw.deadline;
    domainEntity.is_active = raw.is_active;

    if (raw.company) {
      domainEntity.company = companiesMapper.toDomain(raw.company);
    }

    domainEntity.created_at = raw.created_at;

    return domainEntity;
  }
}
