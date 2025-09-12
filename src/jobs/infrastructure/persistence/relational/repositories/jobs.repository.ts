import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, MoreThanOrEqual, LessThanOrEqual } from 'typeorm';
import { JobsEntity } from '../entities/jobs.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { Jobs } from '../../../../domain/jobs';
import { JobsRepository } from '../../jobs.repository';
import { JobsMapper } from '../mappers/jobs.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';
import { FilterJobsDto, SortJobsDto } from '../../../../dto/query-job.dto';

@Injectable()
export class JobsRelationalRepository implements JobsRepository {
  constructor(
    @InjectRepository(JobsEntity)
    private readonly jobsRepository: Repository<JobsEntity>,
  ) { }

  async create(data: Jobs): Promise<Jobs> {
    const persistenceModel = JobsMapper.toPersistence(data);
    const newEntity = await this.jobsRepository.save(
      this.jobsRepository.create(persistenceModel),
    );
    return JobsMapper.toDomain(newEntity);
  }

  async findManyWithPagination({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterJobsDto | null;
    sortOptions?: SortJobsDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<{ data: Jobs[]; totalItems: number }> {
    const where: any = {};

    // Apply filters
    if (filterOptions) {
      // Location filter
      if (filterOptions.location && filterOptions.location.length > 0) {
        where.location = In(filterOptions.location);
      }

      // Salary filter
      if (filterOptions.salary) {
        if (
          filterOptions.salary.min !== undefined &&
          filterOptions.salary.max !== undefined
        ) {
          // Both min and max provided - salary range should overlap with filter range
          where.salary_min = LessThanOrEqual(filterOptions.salary.max);
          where.salary_max = MoreThanOrEqual(filterOptions.salary.min);
        } else if (filterOptions.salary.min !== undefined) {
          // Only min provided
          where.salary_max = MoreThanOrEqual(filterOptions.salary.min);
        } else if (filterOptions.salary.max !== undefined) {
          // Only max provided
          where.salary_min = LessThanOrEqual(filterOptions.salary.max);
        }

        // Currency filter
        if (filterOptions.salary.currency) {
          where.salary_currency = filterOptions.salary.currency;
        }
      }

      // Company filter
      if (filterOptions.company) {
        if (filterOptions.company.id) {
          where.company = { id: filterOptions.company.id };
        } else if (filterOptions.company.name) {
          where.company = { name: filterOptions.company.name };
        }
      }
    }

    // Get total count
    const totalItems = await this.jobsRepository.count({ where });

    // Get paginated data
    const entities = await this.jobsRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
      where: where,
      relations: ['company', 'category', 'locationRef'],
      order: sortOptions?.reduce(
        (accumulator, sort) => ({
          ...accumulator,
          [sort.orderBy]: sort.order,
        }),
        {},
      ),
    });

    const data = entities.map((entity) => JobsMapper.toDomain(entity));

    return { data, totalItems };
  }

  async findById(id: Jobs['id']): Promise<NullableType<Jobs>> {
    const entity = await this.jobsRepository.findOne({
      where: { id: Number(id) },
    });

    return entity ? JobsMapper.toDomain(entity) : null;
  }
}
