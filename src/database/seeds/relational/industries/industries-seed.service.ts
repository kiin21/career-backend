import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IndustriesEntity } from '../../../../industries/infrastructure/persistence/relational/entities/industries.entity';

@Injectable()
export class IndustriesSeedService {
  constructor(
    @InjectRepository(IndustriesEntity)
    private repository: Repository<IndustriesEntity>,
  ) {}

  async run() {
    const count = await this.repository.count();

    if (!count) {
      const industries = [
        {
          name: 'Technology',
          description: 'Software development, AI, and IT services',
        },
        {
          name: 'Finance',
          description: 'Banking, investment, and financial services',
        },
        {
          name: 'Education',
          description: 'EdTech, training, and educational services',
        },
        {
          name: 'Healthcare',
          description: 'Medical services, research, and health technology',
        },
        {
          name: 'Construction',
          description: 'Building, infrastructure, and real estate',
        },
      ];

      for (const industry of industries) {
        await this.repository.save(this.repository.create(industry));
      }
    }
  }
}
