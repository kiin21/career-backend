import {
  // common
  Injectable,
} from '@nestjs/common';
import { CreatelocationsDto } from './dto/create-locations.dto';
import { UpdatelocationsDto } from './dto/update-locations.dto';
import { LocationsRepository } from './infrastructure/persistence/locations.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { Locations } from './domain/locations';

@Injectable()
export class locationsService {
  constructor(
    // Dependencies here
    private readonly locationsRepository: LocationsRepository,
  ) {}

  async create(createlocationsDto: CreatelocationsDto) {
    // Do not remove comment below.
    // <creating-property />

    return this.locationsRepository.create({
      name: createlocationsDto.name,
    });
  }

  findAllWithPagination({ paginationOptions }: { paginationOptions: IPaginationOptions }) {
    return this.locationsRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findById(id: Locations['id']) {
    return this.locationsRepository.findById(id);
  }

  findByIds(ids: Locations['id'][]) {
    return this.locationsRepository.findByIds(ids);
  }

  async update(
    id: Locations['id'],
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    updatelocationsDto: UpdatelocationsDto,
  ) {
    // Do not remove comment below.
    // <updating-property />

    return this.locationsRepository.update(id, {
      // Do not remove comment below.
      // <updating-property-payload />
    });
  }

  remove(id: Locations['id']) {
    return this.locationsRepository.remove(id);
  }
}
