import {
  // common
  Injectable,
} from '@nestjs/common';
import { CreateJobCategoriesDto } from './dto/create-job-categories.dto';
import { UpdateJobCategoriesDto } from './dto/update-job-categories.dto';
import { JobCategoriesRepository } from './infrastructure/persistence/job-categories.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { JobCategories } from './domain/job-categories';

@Injectable()
export class JobCategoriesService {
  constructor(
    // Dependencies here
    private readonly jobCategoriesRepository: JobCategoriesRepository,
  ) {}

  async create(createJobCategoriesDto: CreateJobCategoriesDto) {
    // Do not remove comment below.
    // <creating-property />

    return this.jobCategoriesRepository.create({
      name: createJobCategoriesDto.name,
      description: createJobCategoriesDto.description ?? null,
      // Do not remove comment below.
      // <creating-property-payload />
    });
  }

  findAllWithPagination({ paginationOptions }: { paginationOptions: IPaginationOptions }) {
    return this.jobCategoriesRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findById(id: JobCategories['id']) {
    return this.jobCategoriesRepository.findById(id);
  }

  findByIds(ids: JobCategories['id'][]) {
    return this.jobCategoriesRepository.findByIds(ids);
  }

  async update(
    id: JobCategories['id'],
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    updateJobCategoriesDto: UpdateJobCategoriesDto,
  ) {
    // Do not remove comment below.
    // <updating-property />

    return this.jobCategoriesRepository.update(id, {
      // Do not remove comment below.
      // <updating-property-payload />
    });
  }

  remove(id: JobCategories['id']) {
    return this.jobCategoriesRepository.remove(id);
  }
}
