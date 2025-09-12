import { DeepPartial } from '../../../utils/types/deep-partial.type';
import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { Industries } from '../../domain/industries';

export abstract class IndustriesRepository {
  abstract create(data: Omit<Industries, 'id' | 'created_at' | 'updated_at'>): Promise<Industries>;

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Industries[]>;

  abstract findById(id: Industries['id']): Promise<NullableType<Industries>>;

  abstract findByIds(ids: Industries['id'][]): Promise<Industries[]>;

  abstract update(id: Industries['id'], payload: DeepPartial<Industries>): Promise<Industries | null>;

  abstract remove(id: Industries['id']): Promise<void>;
}
