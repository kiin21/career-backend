import { DeepPartial } from '../../../utils/types/deep-partial.type';
import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { JobSkills } from '../../domain/job-skills';

export abstract class JobSkillsRepository {
  abstract create(
    data: Omit<JobSkills, 'id' | 'created_at' | 'updated_at'>,
  ): Promise<JobSkills>;

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<JobSkills[]>;

  abstract findById(id: JobSkills['id']): Promise<NullableType<JobSkills>>;

  abstract findByIds(ids: JobSkills['id'][]): Promise<JobSkills[]>;

  abstract update(
    id: JobSkills['id'],
    payload: DeepPartial<JobSkills>,
  ): Promise<JobSkills | null>;

  abstract remove(id: JobSkills['id']): Promise<void>;
}
