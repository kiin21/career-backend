import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { JobSkillsEntity } from '../entities/job-skills.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { JobSkills } from '../../../../domain/job-skills';
import { JobSkillsRepository } from '../../job-skills.repository';
import { JobSkillsMapper } from '../mappers/job-skills.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';

@Injectable()
export class JobSkillsRelationalRepository implements JobSkillsRepository {
  constructor(
    @InjectRepository(JobSkillsEntity)
    private readonly jobSkillsRepository: Repository<JobSkillsEntity>,
  ) {}

  async create(data: JobSkills): Promise<JobSkills> {
    const persistenceModel = JobSkillsMapper.toPersistence(data);
    const newEntity = await this.jobSkillsRepository.save(this.jobSkillsRepository.create(persistenceModel));
    return JobSkillsMapper.toDomain(newEntity);
  }

  async findAllWithPagination({ paginationOptions }: { paginationOptions: IPaginationOptions }): Promise<JobSkills[]> {
    const entities = await this.jobSkillsRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });

    return entities.map((entity) => JobSkillsMapper.toDomain(entity));
  }

  async findById(id: JobSkills['id']): Promise<NullableType<JobSkills>> {
    const entity = await this.jobSkillsRepository.findOne({
      where: { job_id: Number(id) },
    });

    return entity ? JobSkillsMapper.toDomain(entity) : null;
  }

  async findByIds(ids: JobSkills['id'][]): Promise<JobSkills[]> {
    const entities = await this.jobSkillsRepository.find({
      where: { job_id: In(ids.map((id) => Number(id))) },
    });

    return entities.map((entity) => JobSkillsMapper.toDomain(entity));
  }

  async update(id: JobSkills['id'], payload: Partial<JobSkills>): Promise<JobSkills> {
    const entity = await this.jobSkillsRepository.findOne({
      where: { job_id: Number(id) },
    });

    if (!entity) {
      throw new Error('Record not found');
    }

    const updatedEntity = await this.jobSkillsRepository.save(
      this.jobSkillsRepository.create(
        JobSkillsMapper.toPersistence({
          ...JobSkillsMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return JobSkillsMapper.toDomain(updatedEntity);
  }

  async remove(id: JobSkills['id']): Promise<void> {
    await this.jobSkillsRepository.delete({ job_id: Number(id) });
  }
}
