import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { IndustriesEntity } from '../entities/industries.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { Industries } from '../../../../domain/industries';
import { IndustriesRepository } from '../../industries.repository';
import { IndustriesMapper } from '../mappers/industries.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';

@Injectable()
export class IndustriesRelationalRepository implements IndustriesRepository {
  constructor(
    @InjectRepository(IndustriesEntity)
    private readonly industriesRepository: Repository<IndustriesEntity>,
  ) {}

  async create(data: Industries): Promise<Industries> {
    const persistenceModel = IndustriesMapper.toPersistence(data);
    const newEntity = await this.industriesRepository.save(
      this.industriesRepository.create(persistenceModel),
    );
    return IndustriesMapper.toDomain(newEntity);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Industries[]> {
    const entities = await this.industriesRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });

    return entities.map((entity) => IndustriesMapper.toDomain(entity));
  }

  async findById(id: Industries['id']): Promise<NullableType<Industries>> {
    const entity = await this.industriesRepository.findOne({
      where: { id: Number(id) },
    });

    return entity ? IndustriesMapper.toDomain(entity) : null;
  }

  async findByIds(ids: Industries['id'][]): Promise<Industries[]> {
    const entities = await this.industriesRepository.find({
      where: { id: In(ids) },
    });

    return entities.map((entity) => IndustriesMapper.toDomain(entity));
  }

  async update(
    id: Industries['id'],
    payload: Partial<Industries>,
  ): Promise<Industries> {
    const entity = await this.industriesRepository.findOne({
      where: { id: Number(id) },
    });

    if (!entity) {
      throw new Error('Record not found');
    }

    const updatedEntity = await this.industriesRepository.save(
      this.industriesRepository.create(
        IndustriesMapper.toPersistence({
          ...IndustriesMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return IndustriesMapper.toDomain(updatedEntity);
  }

  async remove(id: Industries['id']): Promise<void> {
    await this.industriesRepository.delete(id);
  }
}
