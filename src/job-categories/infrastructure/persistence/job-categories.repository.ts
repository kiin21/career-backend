import { DeepPartial } from '../../../utils/types/deep-partial.type';
import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { JobCategories } from '../../domain/job-categories';

export abstract class JobCategoriesRepository {
  abstract create(
    data: Omit<JobCategories, 'id' | 'created_at' | 'updated_at'>,
  ): Promise<JobCategories>;

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<JobCategories[]>;

  abstract findById(
    id: JobCategories['id'],
  ): Promise<NullableType<JobCategories>>;

  abstract findByIds(ids: JobCategories['id'][]): Promise<JobCategories[]>;

  abstract update(
    id: JobCategories['id'],
    payload: DeepPartial<JobCategories>,
  ): Promise<JobCategories | null>;

  abstract remove(id: JobCategories['id']): Promise<void>;
}
