import {
  // common
  Injectable,
} from '@nestjs/common';
import { CreatecompaniesDto } from './dto/create-companies.dto';
import { UpdatecompaniesDto } from './dto/update-companies.dto';
import { companiesRepository } from './infrastructure/persistence/companies.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { Companies } from './domain/companies';

@Injectable()
export class companiesService {
  constructor(
    // Dependencies here
    private readonly companiesRepository: companiesRepository,
  ) { }

  async create(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    createcompaniesDto: CreatecompaniesDto,
  ) {
    // Do not remove comment below.
    // <creating-property />

    return this.companiesRepository.create({
      name: createcompaniesDto.name,
    });
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.companiesRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findById(id: Companies['id']) {
    return this.companiesRepository.findById(id);
  }

  findByIds(ids: Companies['id'][]) {
    return this.companiesRepository.findByIds(ids);
  }

  async update(
    id: Companies['id'],
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    updatecompaniesDto: UpdatecompaniesDto,
  ) {
    // Do not remove comment below.
    // <updating-property />

    return this.companiesRepository.update(id, {
      // Do not remove comment below.
      // <updating-property-payload />
    });
  }

  remove(id: Companies['id']) {
    return this.companiesRepository.remove(id);
  }
}
