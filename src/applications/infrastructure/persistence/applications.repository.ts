import { DeepPartial } from '../../../utils/types/deep-partial.type';
import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { Applications } from '../../domain/applications';

export abstract class ApplicationsRepository {
  abstract create(
    data: Omit<Applications, 'id' | 'created_at' | 'updated_at'>,
  ): Promise<Applications>;

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Applications[]>;

  abstract findById(
    id: Applications['id'],
  ): Promise<NullableType<Applications>>;

  abstract findByIds(ids: Applications['id'][]): Promise<Applications[]>;

  abstract update(
    id: Applications['id'],
    payload: DeepPartial<Applications>,
  ): Promise<Applications | null>;

  abstract remove(id: Applications['id']): Promise<void>;
}
