import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { Jobs } from '../../domain/jobs';
import { SearchJobDto, SortJobDto } from '../../dto/search-job.dto';

export abstract class JobsRepository {
  abstract create(data: Omit<Jobs, 'id' | 'created_at' | 'updated_at'>): Promise<Jobs>;

  abstract findManyWithPagination({
    filterOptions,
    sortOptions,
    paginationOptions,
    search,
  }: {
    filterOptions?: SearchJobDto | null;
    sortOptions?: SortJobDto[] | null;
    paginationOptions: IPaginationOptions;
    search?: string;
  }): Promise<{ data: Jobs[]; totalItems: number }>;

  abstract findById(id: Jobs['id']): Promise<NullableType<Jobs>>;
}
