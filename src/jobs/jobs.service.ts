import {
  // common
  Injectable,
} from '@nestjs/common';
import { JobsRepository } from './infrastructure/persistence/jobs.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { Jobs } from './domain/jobs';
import { FilterJobsDto, SortJobsDto } from './dto/query-job.dto';

@Injectable()
export class JobsService {
  constructor(
    // Dependencies here
    private readonly jobsRepository: JobsRepository,
  ) { }

  findManyWithPagination({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterJobsDto | null;
    sortOptions?: SortJobsDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<{ data: Jobs[]; totalItems: number }> {
    return this.jobsRepository.findManyWithPagination({
      filterOptions,
      sortOptions,
      paginationOptions,
    });
  }

  findById(id: Jobs['id']) {
    return this.jobsRepository.findById(id);
  }
}
