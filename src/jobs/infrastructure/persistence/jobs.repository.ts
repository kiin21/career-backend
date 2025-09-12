import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { Jobs } from '../../domain/jobs';
import { FilterJobsDto, SortJobsDto } from '../../dto/query-job.dto';

export abstract class JobsRepository {
  abstract create(
    data: Omit<Jobs, 'id' | 'created_at' | 'updated_at'>,
  ): Promise<Jobs>;

  abstract findManyWithPagination({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterJobsDto | null;
    sortOptions?: SortJobsDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<{ data: Jobs[]; totalItems: number }>;

  abstract findById(id: Jobs['id']): Promise<NullableType<Jobs>>;
}
