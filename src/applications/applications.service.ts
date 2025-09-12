import {
  // common
  Injectable,
} from '@nestjs/common';
import { CreateApplicationsDto } from './dto/create-applications.dto';
import { UpdateApplicationsDto } from './dto/update-applications.dto';
import { ApplicationsRepository } from './infrastructure/persistence/applications.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { Applications } from './domain/applications';

@Injectable()
export class ApplicationsService {
  constructor(
    // Dependencies here
    private readonly applicationsRepository: ApplicationsRepository,
  ) {}

  async create(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    createApplicationsDto: CreateApplicationsDto,
  ) {
    // Do not remove comment below.
    // <creating-property />

    return this.applicationsRepository.create({
      // Do not remove comment below.
      // <creating-property-payload />
    });
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.applicationsRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findById(id: Applications['id']) {
    return this.applicationsRepository.findById(id);
  }

  findByIds(ids: Applications['id'][]) {
    return this.applicationsRepository.findByIds(ids);
  }

  async update(
    id: Applications['id'],
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    updateApplicationsDto: UpdateApplicationsDto,
  ) {
    // Do not remove comment below.
    // <updating-property />

    return this.applicationsRepository.update(id, {
      // Do not remove comment below.
      // <updating-property-payload />
    });
  }

  remove(id: Applications['id']) {
    return this.applicationsRepository.remove(id);
  }
}
