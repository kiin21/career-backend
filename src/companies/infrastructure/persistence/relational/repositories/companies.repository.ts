import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { CompaniesEntity } from '../entities/companies.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { Companies } from '../../../../domain/companies';
import { CompaniesRepository } from '../../companies.repository';
import { CompaniesMapper } from '../mappers/companies.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';

@Injectable()
export class CompaniesRelationalRepository implements CompaniesRepository {
  constructor(
    @InjectRepository(CompaniesEntity)
    private readonly companiesRepository: Repository<CompaniesEntity>,
  ) {}

  async create(data: Companies): Promise<Companies> {
    const persistenceModel = CompaniesMapper.toPersistence(data);
    const newEntity = await this.companiesRepository.save(this.companiesRepository.create(persistenceModel));
    return CompaniesMapper.toDomain(newEntity);
  }

  async findAllWithPagination({ paginationOptions }: { paginationOptions: IPaginationOptions }): Promise<Companies[]> {
    const entities = await this.companiesRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });

    return entities.map((entity) => CompaniesMapper.toDomain(entity));
  }

  async findById(id: Companies['id']): Promise<NullableType<Companies>> {
    const entity = await this.companiesRepository.findOne({
      where: { id: Number(id) },
    });

    return entity ? CompaniesMapper.toDomain(entity) : null;
  }

  async findByIds(ids: Companies['id'][]): Promise<Companies[]> {
    const entities = await this.companiesRepository.find({
      where: { id: In(ids) },
    });

    return entities.map((entity) => CompaniesMapper.toDomain(entity));
  }

  async update(id: Companies['id'], payload: Partial<Companies>): Promise<Companies> {
    const entity = await this.companiesRepository.findOne({
      where: { id: Number(id) },
    });

    if (!entity) {
      throw new Error('Record not found');
    }

    const updatedEntity = await this.companiesRepository.save(
      this.companiesRepository.create(
        CompaniesMapper.toPersistence({
          ...CompaniesMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return CompaniesMapper.toDomain(updatedEntity);
  }

  async remove(id: Companies['id']): Promise<void> {
    await this.companiesRepository.delete(id);
  }
}
