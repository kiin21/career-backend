import {
  // common
  Injectable,
} from '@nestjs/common';
import { CreateJobSkillsDto } from './dto/create-job-skills.dto';
import { UpdateJobSkillsDto } from './dto/update-job-skills.dto';
import { JobSkillsRepository } from './infrastructure/persistence/job-skills.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { JobSkills } from './domain/job-skills';

@Injectable()
export class JobSkillsService {
  constructor(
    // Dependencies here
    private readonly jobSkillsRepository: JobSkillsRepository,
  ) {}

  async create(createJobSkillsDto: CreateJobSkillsDto) {
    // Do not remove comment below.
    // <creating-property />

    return this.jobSkillsRepository.create({
      skill_name: createJobSkillsDto.skill_name,
      // Do not remove comment below.
      // <creating-property-payload />
    });
  }

  findAllWithPagination({ paginationOptions }: { paginationOptions: IPaginationOptions }) {
    return this.jobSkillsRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findById(id: JobSkills['id']) {
    return this.jobSkillsRepository.findById(id);
  }

  findByIds(ids: JobSkills['id'][]) {
    return this.jobSkillsRepository.findByIds(ids);
  }

  async update(
    id: JobSkills['id'],
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    updateJobSkillsDto: UpdateJobSkillsDto,
  ) {
    // Do not remove comment below.
    // <updating-property />

    return this.jobSkillsRepository.update(id, {
      // Do not remove comment below.
      // <updating-property-payload />
    });
  }

  remove(id: JobSkills['id']) {
    return this.jobSkillsRepository.remove(id);
  }
}
