import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CompaniesEntity } from '../../../../companies/infrastructure/persistence/relational/entities/companies.entity';
import { IndustriesEntity } from '../../../../industries/infrastructure/persistence/relational/entities/industries.entity';

@Injectable()
export class CompaniesSeedService {
  constructor(
    @InjectRepository(CompaniesEntity)
    private companiesRepository: Repository<CompaniesEntity>,
    @InjectRepository(IndustriesEntity)
    private industriesRepository: Repository<IndustriesEntity>,
  ) {}

  async run() {
    const count = await this.companiesRepository.count();

    if (!count) {
      // Get industries to set relations
      const technology = await this.industriesRepository.findOne({
        where: { name: 'Technology' },
      });
      const finance = await this.industriesRepository.findOne({
        where: { name: 'Finance' },
      });
      const education = await this.industriesRepository.findOne({
        where: { name: 'Education' },
      });
      const healthcare = await this.industriesRepository.findOne({
        where: { name: 'Healthcare' },
      });
      const construction = await this.industriesRepository.findOne({
        where: { name: 'Construction' },
      });

      const companies = [
        {
          name: 'TechNova',
          description: 'AI and cloud software solutions',
          website: 'https://technova.com',
          industry: technology!,
          size: 150,
          contactEmail: 'hr@technova.com',
          logoUrl: 'https://logo.com/technova.png',
          address: 'Hanoi, Vietnam',
        },
        {
          name: 'GreenBank',
          description: 'Sustainable banking and finance services',
          website: 'https://greenbank.com',
          industry: finance!,
          size: 500,
          contactEmail: 'careers@greenbank.com',
          logoUrl: 'https://logo.com/greenbank.png',
          address: 'Ho Chi Minh City, Vietnam',
        },
        {
          name: 'EduNext',
          description: 'EdTech platform for lifelong learning',
          website: 'https://edunext.com',
          industry: education!,
          size: 80,
          contactEmail: 'jobs@edunext.com',
          logoUrl: 'https://logo.com/edunext.png',
          address: 'Da Nang, Vietnam',
        },
        {
          name: 'HealthPlus',
          description: 'Healthcare provider and medical research',
          website: 'https://healthplus.com',
          industry: healthcare!,
          size: 300,
          contactEmail: 'talent@healthplus.com',
          logoUrl: 'https://logo.com/healthplus.png',
          address: 'Ho Chi Minh City, Vietnam',
        },
        {
          name: 'BuildIT',
          description: 'Construction and infrastructure company',
          website: 'https://buildit.com',
          industry: construction!,
          size: 200,
          contactEmail: 'recruit@buildit.com',
          logoUrl: 'https://logo.com/buildit.png',
          address: 'Hanoi, Vietnam',
        },
      ];

      for (const company of companies) {
        await this.companiesRepository.save(
          this.companiesRepository.create(company),
        );
      }
    }
  }
}
