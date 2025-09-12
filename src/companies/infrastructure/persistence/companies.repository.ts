import { DeepPartial } from '../../../utils/types/deep-partial.type';
import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { Companies } from '../../domain/companies';

export abstract class companiesRepository {
  abstract create(
    data: Omit<Companies, 'id' | 'created_at' | 'updated_at'>,
  ): Promise<Companies>;

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Companies[]>;

  abstract findById(id: Companies['id']): Promise<NullableType<Companies>>;

  abstract findByIds(ids: Companies['id'][]): Promise<Companies[]>;

  abstract update(
    id: Companies['id'],
    payload: DeepPartial<Companies>,
  ): Promise<Companies | null>;

  abstract remove(id: Companies['id']): Promise<void>;
}
