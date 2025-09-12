import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JobCategoriesEntity } from '../../../../job-categories/infrastructure/persistence/relational/entities/job-categories.entity';

@Injectable()
export class JobCategoriesSeedService {
  constructor(
    @InjectRepository(JobCategoriesEntity)
    private repository: Repository<JobCategoriesEntity>,
  ) {}

  async run() {
    const count = await this.repository.count();

    if (!count) {
      const categories = [
        {
          name: 'Engineering',
          description: 'Software, DevOps, QA, and technical roles',
        },
        {
          name: 'Business',
          description: 'Finance, analysis, and business operations',
        },
        {
          name: 'Design',
          description: 'UI/UX, content, and creative roles',
        },
        {
          name: 'Healthcare',
          description: 'Medical, nursing, and clinical roles',
        },
        {
          name: 'Management',
          description: 'Leadership, project management, and coordination',
        },
      ];

      for (const category of categories) {
        await this.repository.save(this.repository.create(category));
      }
    }
  }
}
