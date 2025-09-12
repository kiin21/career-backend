import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { JobsEntity } from '../entities/jobs.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { Jobs } from '../../../../domain/jobs';
import { JobsRepository } from '../../jobs.repository';
import { JobsMapper } from '../mappers/jobs.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';
import { SearchJobDto, SortJobDto } from '../../../../dto/search-job.dto';

@Injectable()
export class JobsRelationalRepository implements JobsRepository {
  constructor(
    @InjectRepository(JobsEntity)
    private readonly jobsRepository: Repository<JobsEntity>,
  ) {}

  async create(data: Jobs): Promise<Jobs> {
    const persistenceModel = JobsMapper.toPersistence(data);
    const newEntity = await this.jobsRepository.save(this.jobsRepository.create(persistenceModel));
    return JobsMapper.toDomain(newEntity);
  }

  private addRelations(queryBuilder: SelectQueryBuilder<JobsEntity>): void {
    queryBuilder
      .leftJoinAndSelect('job.company', 'company')
      .leftJoinAndSelect('job.category', 'category')
      .leftJoinAndSelect('job.locationRef', 'locationRef');
  }

  private applyFilters(
    queryBuilder: SelectQueryBuilder<JobsEntity>,
    filterOptions?: SearchJobDto | null,
    isCountQuery: boolean = false,
  ): void {
    if (!filterOptions) return;

    // Location filter
    if (filterOptions.location && filterOptions.location.length > 0) {
      queryBuilder.andWhere('job.location IN (:...locations)', {
        locations: filterOptions.location,
      });
    }

    // Salary filter
    if (filterOptions.salary) {
      const { min, max } = filterOptions.salary;

      if (min !== undefined && max !== undefined) {
        queryBuilder.andWhere('job.salary_min <= :salaryMax AND job.salary_max >= :salaryMin', {
          salaryMax: max,
          salaryMin: min,
        });
      } else if (min !== undefined) {
        queryBuilder.andWhere('job.salary_max >= :salaryMin', {
          salaryMin: min,
        });
      } else if (max !== undefined) {
        queryBuilder.andWhere('job.salary_min <= :salaryMax', {
          salaryMax: max,
        });
      }
    }

    // Employment type filter
    if (filterOptions.employment_type) {
      queryBuilder.andWhere('job.employment_type = :employmentType', {
        employmentType: filterOptions.employment_type,
      });
    }

    // Company filter
    if (filterOptions.company?.ids && filterOptions.company.ids.length > 0) {
      if (isCountQuery) {
        queryBuilder.andWhere('job.company_id IN (:...companyIds)', {
          companyIds: filterOptions.company.ids,
        });
      } else {
        queryBuilder.andWhere('company.id IN (:...companyIds)', {
          companyIds: filterOptions.company.ids,
        });
      }
    }
  }

  private applySearch(
    queryBuilder: SelectQueryBuilder<JobsEntity>,
    search?: string,
    isCountQuery: boolean = false,
  ): void {
    if (!search?.trim()) return;

    // Sanitize search input
    const sanitizedSearch = search.trim().replace(/[<>]/g, '');

    if (isCountQuery) {
      // For count query, add company join only if not already added
      const hasCompanyJoin = queryBuilder.expressionMap.joinAttributes.some((join) => join.alias.name === 'company');
      if (!hasCompanyJoin) {
        queryBuilder.leftJoin('job.company', 'company');
      }
    }

    queryBuilder.andWhere(
      `(
        job.title ILIKE :searchPattern 
        OR job.description ILIKE :searchPattern 
        OR company.name ILIKE :searchPattern
        OR to_tsvector('english', COALESCE(job.title, '') || ' ' || COALESCE(job.description, '')) @@ plainto_tsquery('english', :search)
      )`,
      {
        search: sanitizedSearch,
        searchPattern: `%${sanitizedSearch}%`,
      },
    );
  }

  private applySorting(queryBuilder: SelectQueryBuilder<JobsEntity>, sortOptions?: SortJobDto[] | null): void {
    if (sortOptions && sortOptions.length > 0) {
      sortOptions.forEach((sort, index) => {
        const orderMethod = index === 0 ? 'orderBy' : 'addOrderBy';
        queryBuilder[orderMethod](`job.${sort.orderBy}`, sort.order as 'ASC' | 'DESC');
      });
    } else {
      // Default sort
      queryBuilder.orderBy('job.created_at', 'DESC');
    }
  }

  async findManyWithPagination({
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
    try {
      // Main query
      const queryBuilder = this.jobsRepository.createQueryBuilder('job');
      this.addRelations(queryBuilder);
      this.applyFilters(queryBuilder, filterOptions);
      this.applySearch(queryBuilder, search);
      this.applySorting(queryBuilder, sortOptions);

      // Count query
      const countQueryBuilder = this.jobsRepository.createQueryBuilder('job');
      this.applyFilters(countQueryBuilder, filterOptions, true);
      this.applySearch(countQueryBuilder, search, true);

      // Execute count query first
      const totalItems = await countQueryBuilder.getCount();

      // Skip main query if no results
      if (totalItems === 0) {
        return { data: [], totalItems: 0 };
      }

      // Apply pagination to main query
      queryBuilder.skip((paginationOptions.page - 1) * paginationOptions.limit).take(paginationOptions.limit);

      const entities = await queryBuilder.getMany();
      const data = entities.map((entity) => JobsMapper.toDomain(entity));

      return { data, totalItems };
    } catch (error) {
      throw new Error(`Failed to fetch jobs: ${error.message}`);
    }
  }

  async findById(id: Jobs['id']): Promise<NullableType<Jobs>> {
    try {
      const entity = await this.jobsRepository.findOne({
        where: { id: Number(id) },
        relations: ['company', 'category', 'locationRef'],
      });

      return entity ? JobsMapper.toDomain(entity) : null;
    } catch (error) {
      throw new Error(`Failed to find job with id ${id}: ${error.message}`);
    }
  }
}
