import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { JobCategoriesEntity } from '../entities/job-categories.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { JobCategories } from '../../../../domain/job-categories';
import { JobCategoriesRepository } from '../../job-categories.repository';
import { JobCategoriesMapper } from '../mappers/job-categories.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';

@Injectable()
export class JobCategoriesRelationalRepository
  implements JobCategoriesRepository
{
  constructor(
    @InjectRepository(JobCategoriesEntity)
    private readonly jobCategoriesRepository: Repository<JobCategoriesEntity>,
  ) {}

  async create(data: JobCategories): Promise<JobCategories> {
    const persistenceModel = JobCategoriesMapper.toPersistence(data);
    const newEntity = await this.jobCategoriesRepository.save(
      this.jobCategoriesRepository.create(persistenceModel),
    );
    return JobCategoriesMapper.toDomain(newEntity);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<JobCategories[]> {
    const entities = await this.jobCategoriesRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });

    return entities.map((entity) => JobCategoriesMapper.toDomain(entity));
  }

  async findById(
    id: JobCategories['id'],
  ): Promise<NullableType<JobCategories>> {
    const entity = await this.jobCategoriesRepository.findOne({
      where: { id: Number(id) },
    });

    return entity ? JobCategoriesMapper.toDomain(entity) : null;
  }

  async findByIds(ids: JobCategories['id'][]): Promise<JobCategories[]> {
    const entities = await this.jobCategoriesRepository.find({
      where: { id: In(ids) },
    });

    return entities.map((entity) => JobCategoriesMapper.toDomain(entity));
  }

  async update(
    id: JobCategories['id'],
    payload: Partial<JobCategories>,
  ): Promise<JobCategories> {
    const entity = await this.jobCategoriesRepository.findOne({
      where: { id: Number(id) },
    });

    if (!entity) {
      throw new Error('Record not found');
    }

    const updatedEntity = await this.jobCategoriesRepository.save(
      this.jobCategoriesRepository.create(
        JobCategoriesMapper.toPersistence({
          ...JobCategoriesMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return JobCategoriesMapper.toDomain(updatedEntity);
  }

  async remove(id: JobCategories['id']): Promise<void> {
    await this.jobCategoriesRepository.delete(id);
  }
}
