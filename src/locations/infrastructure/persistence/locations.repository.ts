import { DeepPartial } from '../../../utils/types/deep-partial.type';
import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { Locations } from '../../domain/locations';

export abstract class LocationsRepository {
  abstract create(data: Omit<Locations, 'id' | 'created_at' | 'updated_at'>): Promise<Locations>;

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Locations[]>;

  abstract findById(id: Locations['id']): Promise<NullableType<Locations>>;

  abstract findByIds(ids: Locations['id'][]): Promise<Locations[]>;

  abstract update(id: Locations['id'], payload: DeepPartial<Locations>): Promise<Locations | null>;

  abstract remove(id: Locations['id']): Promise<void>;
}
