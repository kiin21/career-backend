import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { ApplicationsEntity } from '../entities/applications.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { Applications } from '../../../../domain/applications';
import { ApplicationsRepository } from '../../applications.repository';
import { ApplicationsMapper } from '../mappers/applications.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';

@Injectable()
export class ApplicationsRelationalRepository
  implements ApplicationsRepository
{
  constructor(
    @InjectRepository(ApplicationsEntity)
    private readonly applicationsRepository: Repository<ApplicationsEntity>,
  ) {}

  async create(data: Applications): Promise<Applications> {
    const persistenceModel = ApplicationsMapper.toPersistence(data);
    const newEntity = await this.applicationsRepository.save(
      this.applicationsRepository.create(persistenceModel),
    );
    return ApplicationsMapper.toDomain(newEntity);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Applications[]> {
    const entities = await this.applicationsRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });

    return entities.map((entity) => ApplicationsMapper.toDomain(entity));
  }

  async findById(id: Applications['id']): Promise<NullableType<Applications>> {
    const entity = await this.applicationsRepository.findOne({
      where: { id: Number(id) },
    });

    return entity ? ApplicationsMapper.toDomain(entity) : null;
  }

  async findByIds(ids: Applications['id'][]): Promise<Applications[]> {
    const entities = await this.applicationsRepository.find({
      where: { id: In(ids) },
    });

    return entities.map((entity) => ApplicationsMapper.toDomain(entity));
  }

  async update(
    id: Applications['id'],
    payload: Partial<Applications>,
  ): Promise<Applications> {
    const entity = await this.applicationsRepository.findOne({
      where: { id: Number(id) },
    });

    if (!entity) {
      throw new Error('Record not found');
    }

    const updatedEntity = await this.applicationsRepository.save(
      this.applicationsRepository.create(
        ApplicationsMapper.toPersistence({
          ...ApplicationsMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return ApplicationsMapper.toDomain(updatedEntity);
  }

  async remove(id: Applications['id']): Promise<void> {
    await this.applicationsRepository.delete(id);
  }
}
