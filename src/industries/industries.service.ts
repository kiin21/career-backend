import {
  // common
  Injectable,
} from '@nestjs/common';
import { CreateIndustriesDto } from './dto/create-industries.dto';
import { UpdateIndustriesDto } from './dto/update-industries.dto';
import { IndustriesRepository } from './infrastructure/persistence/industries.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { Industries } from './domain/industries';

@Injectable()
export class IndustriesService {
  constructor(
    // Dependencies here
    private readonly industriesRepository: IndustriesRepository,
  ) {}

  async create(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    createIndustriesDto: CreateIndustriesDto,
  ) {
    // Do not remove comment below.
    // <creating-property />

    return this.industriesRepository.create({
      // Do not remove comment below.
      // <creating-property-payload />
    });
  }

  findAllWithPagination({ paginationOptions }: { paginationOptions: IPaginationOptions }) {
    return this.industriesRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findById(id: Industries['id']) {
    return this.industriesRepository.findById(id);
  }

  findByIds(ids: Industries['id'][]) {
    return this.industriesRepository.findByIds(ids);
  }

  async update(
    id: Industries['id'],
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    updateIndustriesDto: UpdateIndustriesDto,
  ) {
    // Do not remove comment below.
    // <updating-property />

    return this.industriesRepository.update(id, {
      // Do not remove comment below.
      // <updating-property-payload />
    });
  }

  remove(id: Industries['id']) {
    return this.industriesRepository.remove(id);
  }
}
