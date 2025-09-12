import { Injectable } from '@nestjs/common';
import { JobsRepository } from './infrastructure/persistence/jobs.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { Jobs } from './domain/jobs';
import { SearchJobDto, SortJobDto } from './dto/search-job.dto';

@Injectable()
export class JobsService {
  constructor(private readonly jobsRepository: JobsRepository) {}

  findManyWithPagination({
    filterOptions,
    sortOptions,
    paginationOptions,
    search,
  }: {
    filterOptions?: SearchJobDto | null;
    sortOptions?: SortJobDto[] | null;
    paginationOptions: IPaginationOptions;
    search?: string;
  }): Promise<{ data: Jobs[]; totalItems: number }> {
    return this.jobsRepository.findManyWithPagination({
      filterOptions,
      sortOptions,
      paginationOptions,
      search,
    });
  }

  findById(id: Jobs['id']) {
    return this.jobsRepository.findById(id);
  }
}
