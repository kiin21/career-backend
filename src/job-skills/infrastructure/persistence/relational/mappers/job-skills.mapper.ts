import { JobSkills } from '../../../../domain/job-skills';
import { JobSkillsEntity } from '../entities/job-skills.entity';

export class JobSkillsMapper {
  static toDomain(raw: JobSkillsEntity): JobSkills {
    const domainEntity = new JobSkills();
    domainEntity.id = raw.job_id;
    domainEntity.created_at = raw.created_at;
    domainEntity.updated_at = raw.updated_at;

    return domainEntity;
  }

  static toPersistence(domainEntity: JobSkills): JobSkillsEntity {
    const persistenceEntity = new JobSkillsEntity();
    if (domainEntity.id) {
      persistenceEntity.job_id = Number(domainEntity.id);
    }
    persistenceEntity.created_at = domainEntity.created_at;
    persistenceEntity.updated_at = domainEntity.updated_at;

    return persistenceEntity;
  }
}
