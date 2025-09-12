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
  ) { }

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
          logo_url:
            'https://media.licdn.com/dms/image/v2/D4D0BAQG_mClg3C-uqg/company-logo_200_200/company-logo_200_200/0/1726223293426/technova_us_logo?e=1760572800&v=beta&t=tZ8zAV2ttE9PEyhbwbW6lu8fQWvZ0_JPLdrdfT15vEM',
          address: 'Hanoi, Vietnam',
        },
        {
          name: 'GreenBank',
          description: 'Sustainable banking and finance services',
          website: 'https://greenbank.com',
          industry: finance!,
          size: 500,
          contactEmail: 'careers@greenbank.com',
          logo_url:
            'https://media.licdn.com/dms/image/v2/C4D0BAQE-wcs4wkjOdA/company-logo_200_200/company-logo_200_200/0/1630523629234/greenbank_group_logo?e=1760572800&v=beta&t=ldRUzfN9eClqzj6HgPnWWgRC9iSzeND5UWj41HCh4Qs',
          address: 'Ho Chi Minh City, Vietnam',
        },
        {
          name: 'EduNext',
          description: 'EdTech platform for lifelong learning',
          website: 'https://edunext.com',
          industry: education!,
          size: 80,
          contactEmail: 'jobs@edunext.com',
          logo_url:
            'https://media.licdn.com/dms/image/v2/C560BAQHCXdmDfK5SwA/company-logo_200_200/company-logo_200_200/0/1630655472399/edunext_logo?e=1760572800&v=beta&t=t081F7CWmLpsPGHai19dg15V96Wm59eq66qEBqhBqew',
          address: 'Da Nang, Vietnam',
        },
        {
          name: 'HealthPlus',
          description: 'Healthcare provider and medical research',
          website: 'https://healthplus.com',
          industry: healthcare!,
          size: 300,
          contactEmail: 'talent@healthplus.com',
          logo_url:
            'https://media.licdn.com/dms/image/v2/C4D0BAQHsvpSY6jaWJQ/company-logo_200_200/company-logo_200_200/0/1631373032805/health_plus_logo?e=1760572800&v=beta&t=BZNv0pQie66r4uAtttvifKRRNWXuEZ3Z7VxnmoerdOo',
          address: 'Ho Chi Minh City, Vietnam',
        },
        {
          name: 'BuildIT',
          description: 'Construction and infrastructure company',
          website: 'https://buildit.com',
          industry: construction!,
          size: 200,
          contactEmail: 'recruit@buildit.com',
          logo_url:
            'https://media.licdn.com/dms/image/v2/C4D0BAQFQkO_hiUk1pw/company-logo_200_200/company-logo_200_200/0/1631376007056/build_it_by_design_logo?e=1760572800&v=beta&t=ckvEWu5nIU5ZoPg703bNAufKTNGmEqtuxxoK0IOoMIc',
          address: 'Hanoi, Vietnam',
        },
      ];

      for (const company of companies) {
        await this.companiesRepository.save(this.companiesRepository.create(company));
      }
    }
  }
}
