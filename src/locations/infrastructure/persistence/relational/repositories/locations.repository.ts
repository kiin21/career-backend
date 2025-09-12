import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { LocationsEntity } from '../entities/locations.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { Locations } from '../../../../domain/locations';
import { LocationsRepository } from '../../locations.repository';
import { LocationsMapper } from '../mappers/locations.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';

@Injectable()
export class locationsRelationalRepository implements LocationsRepository {
  constructor(
    @InjectRepository(LocationsEntity)
    private readonly locationsRepository: Repository<LocationsEntity>,
  ) {}

  async create(data: Locations): Promise<Locations> {
    const persistenceModel = LocationsMapper.toPersistence(data);
    const newEntity = await this.locationsRepository.save(this.locationsRepository.create(persistenceModel));
    return LocationsMapper.toDomain(newEntity);
  }

  async findAllWithPagination({ paginationOptions }: { paginationOptions: IPaginationOptions }): Promise<Locations[]> {
    const entities = await this.locationsRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });

    return entities.map((entity) => LocationsMapper.toDomain(entity));
  }

  async findById(id: Locations['id']): Promise<NullableType<Locations>> {
    const entity = await this.locationsRepository.findOne({
      where: { id: Number(id) },
    });

    return entity ? LocationsMapper.toDomain(entity) : null;
  }

  async findByIds(ids: Locations['id'][]): Promise<Locations[]> {
    const entities = await this.locationsRepository.find({
      where: { id: In(ids) },
    });

    return entities.map((entity) => LocationsMapper.toDomain(entity));
  }

  async update(id: Locations['id'], payload: Partial<Locations>): Promise<Locations> {
    const entity = await this.locationsRepository.findOne({
      where: { id: Number(id) },
    });

    if (!entity) {
      throw new Error('Record not found');
    }

    const updatedEntity = await this.locationsRepository.save(
      this.locationsRepository.create(
        LocationsMapper.toPersistence({
          ...LocationsMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return LocationsMapper.toDomain(updatedEntity);
  }

  async remove(id: Locations['id']): Promise<void> {
    await this.locationsRepository.delete(id);
  }
}
