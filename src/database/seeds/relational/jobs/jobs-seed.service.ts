import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JobsEntity } from '../../../../jobs/infrastructure/persistence/relational/entities/jobs.entity';
import { CompaniesEntity } from '../../../../companies/infrastructure/persistence/relational/entities/companies.entity';
import { JobCategoriesEntity } from '../../../../job-categories/infrastructure/persistence/relational/entities/job-categories.entity';
import { LocationsEntity } from '../../../../locations/infrastructure/persistence/relational/entities/locations.entity';

@Injectable()
export class JobsSeedService {
  constructor(
    @InjectRepository(JobsEntity)
    private jobsRepository: Repository<JobsEntity>,
    @InjectRepository(CompaniesEntity)
    private companiesRepository: Repository<CompaniesEntity>,
    @InjectRepository(JobCategoriesEntity)
    private categoriesRepository: Repository<JobCategoriesEntity>,
    @InjectRepository(LocationsEntity)
    private locationsRepository: Repository<LocationsEntity>,
  ) { }

  async run() {
    const count = await this.jobsRepository.count();

    if (!count) {
      // Get companies
      const technova = await this.companiesRepository.findOne({
        where: { name: 'TechNova' },
      });
      const greenbank = await this.companiesRepository.findOne({
        where: { name: 'GreenBank' },
      });
      const edunext = await this.companiesRepository.findOne({
        where: { name: 'EduNext' },
      });
      const healthplus = await this.companiesRepository.findOne({
        where: { name: 'HealthPlus' },
      });
      const buildit = await this.companiesRepository.findOne({
        where: { name: 'BuildIT' },
      });

      // Get categories
      const engineering = await this.categoriesRepository.findOne({
        where: { name: 'Engineering' },
      });
      const business = await this.categoriesRepository.findOne({
        where: { name: 'Business' },
      });
      const design = await this.categoriesRepository.findOne({
        where: { name: 'Design' },
      });
      const healthcare = await this.categoriesRepository.findOne({
        where: { name: 'Healthcare' },
      });
      const management = await this.categoriesRepository.findOne({
        where: { name: 'Management' },
      });

      // Get locations
      const onsite = await this.locationsRepository.findOne({
        where: { name: 'Onsite' },
      });
      const remote = await this.locationsRepository.findOne({
        where: { name: 'Remote' },
      });
      const hybrid = await this.locationsRepository.findOne({
        where: { name: 'Hybrid' },
      });

      const jobs = [
        // TechNova jobs
        {
          company: technova!,
          category: engineering!,
          locationRef: onsite!,
          title: 'Software Engineer',
          description: 'Develop backend systems and APIs for our AI platform',
          requirements: 'Bachelor in CS, 1+ years experience with Python, REST APIs',
          location: 'Hanoi',
          employment_type: 'full_time',
          experience_level: 'junior',
          salary_min: 25000000,
          salary_max: 35000000,
          salary_currency: 'VND',
          application_method: 'internal',
          application_email: 'jobs@technova.com',
          apply_count: 5,
          is_active: true,
          deadline: new Date('2025-12-31'),
        },
        {
          company: technova!,
          category: engineering!,
          locationRef: remote!,
          title: 'AI Research Intern',
          description: 'Assist in ML research projects and model development',
          requirements: 'Final year student, Python, basic ML knowledge',
          location: null,
          employment_type: 'part_time',
          experience_level: 'internship',
          salary_min: 5000000,
          salary_max: 8000000,
          salary_currency: 'VND',
          application_method: 'internal',
          application_email: 'jobs@technova.com',
          apply_count: 3,
          is_active: true,
          deadline: new Date('2025-10-15'),
        },
        {
          company: technova!,
          category: engineering!,
          locationRef: onsite!,
          title: 'DevOps Engineer',
          description: 'Maintain CI/CD pipelines and cloud infrastructure',
          requirements: 'DevOps experience, Docker, Kubernetes, AWS',
          location: 'Ho Chi Minh City',
          employment_type: 'full_time',
          experience_level: 'middle',
          salary_min: 30000000,
          salary_max: 40000000,
          salary_currency: 'VND',
          application_method: 'internal',
          application_email: 'jobs@technova.com',
          apply_count: 2,
          is_active: true,
          deadline: new Date('2025-11-30'),
        },

        // GreenBank jobs
        {
          company: greenbank!,
          category: business!,
          locationRef: onsite!,
          title: 'Financial Analyst',
          description: 'Support investment analysis and financial reporting',
          requirements: 'Finance degree, Excel proficiency, analytical skills',
          location: 'Hanoi',
          employment_type: 'full_time',
          experience_level: 'junior',
          salary_min: 20000000,
          salary_max: 30000000,
          salary_currency: 'VND',
          application_method: 'external',
          application_email: null,
          apply_count: 4,
          is_active: true,
          deadline: new Date('2025-12-15'),
        },
        {
          company: greenbank!,
          category: business!,
          locationRef: onsite!,
          title: 'Branch Manager',
          description: 'Lead branch operations and customer service',
          requirements: 'Management experience, finance background, leadership skills',
          location: 'Ho Chi Minh City',
          employment_type: 'full_time',
          experience_level: 'senior',
          salary_min: 35000000,
          salary_max: 50000000,
          salary_currency: 'VND',
          application_method: 'external',
          application_email: null,
          apply_count: 1,
          is_active: true,
          deadline: new Date('2025-12-20'),
        },

        // EduNext jobs
        {
          company: edunext!,
          category: design!,
          locationRef: remote!,
          title: 'Content Designer',
          description: 'Create engaging learning content for online courses',
          requirements: 'Content creation experience, instructional design knowledge',
          location: null,
          employment_type: 'full_time',
          experience_level: 'junior',
          salary_min: 18000000,
          salary_max: 28000000,
          salary_currency: 'VND',
          application_method: 'internal',
          application_email: 'hiring@edunext.com',
          apply_count: 2,
          is_active: true,
          deadline: new Date('2025-11-15'),
        },
        {
          company: edunext!,
          category: engineering!,
          locationRef: hybrid!,
          title: 'Frontend Developer',
          description: 'Build responsive user interfaces for learning platform',
          requirements: 'React, JavaScript, CSS, responsive design',
          location: 'Hanoi',
          employment_type: 'full_time',
          experience_level: 'junior',
          salary_min: 25000000,
          salary_max: 33000000,
          salary_currency: 'VND',
          application_method: 'internal',
          application_email: 'hiring@edunext.com',
          apply_count: 3,
          is_active: true,
          deadline: new Date('2025-12-01'),
        },
        {
          company: edunext!,
          category: business!,
          locationRef: remote!,
          title: 'Data Analyst Intern',
          description: 'Analyze learning platform usage and performance data',
          requirements: 'SQL knowledge, Excel, basic Python, statistics',
          location: null,
          employment_type: 'internship',
          experience_level: 'internship',
          salary_min: 4000000,
          salary_max: 7000000,
          salary_currency: 'VND',
          application_method: 'internal',
          application_email: 'hiring@edunext.com',
          apply_count: 2,
          is_active: true,
          deadline: new Date('2025-10-30'),
        },

        // HealthPlus jobs
        {
          company: healthplus!,
          category: healthcare!,
          locationRef: onsite!,
          title: 'Nurse Practitioner',
          description: 'Provide direct patient care and clinical support',
          requirements: 'Nursing degree, clinical experience, patient care skills',
          location: 'Ho Chi Minh City',
          employment_type: 'full_time',
          experience_level: 'middle',
          salary_min: 20000000,
          salary_max: 28000000,
          salary_currency: 'VND',
          application_method: 'internal',
          application_email: 'jobs@healthplus.com',
          apply_count: 2,
          is_active: true,
          deadline: new Date('2025-12-15'),
        },
        {
          company: healthplus!,
          category: healthcare!,
          locationRef: hybrid!,
          title: 'Clinical Research Assistant',
          description: 'Support medical research trials and data collection',
          requirements: 'Healthcare background, research experience, attention to detail',
          location: 'Hanoi',
          employment_type: 'full_time',
          experience_level: 'junior',
          salary_min: 22000000,
          salary_max: 30000000,
          salary_currency: 'VND',
          application_method: 'internal',
          application_email: 'jobs@healthplus.com',
          apply_count: 1,
          is_active: true,
          deadline: new Date('2025-11-25'),
        },
        {
          company: healthplus!,
          category: business!,
          locationRef: remote!,
          title: 'Medical Data Analyst',
          description: 'Analyze healthcare data for insights and reporting',
          requirements: 'SQL, healthcare domain knowledge, statistics',
          location: null,
          employment_type: 'full_time',
          experience_level: 'middle',
          salary_min: 25000000,
          salary_max: 35000000,
          salary_currency: 'VND',
          application_method: 'internal',
          application_email: 'jobs@healthplus.com',
          apply_count: 2,
          is_active: true,
          deadline: new Date('2025-12-20'),
        },

        // BuildIT jobs
        {
          company: buildit!,
          category: engineering!,
          locationRef: onsite!,
          title: 'Civil Engineer',
          description: 'Design and oversee construction projects',
          requirements: 'Civil Engineering degree, AutoCAD, project management',
          location: 'Da Nang',
          employment_type: 'full_time',
          experience_level: 'middle',
          salary_min: 28000000,
          salary_max: 38000000,
          salary_currency: 'VND',
          application_method: 'external',
          application_email: null,
          apply_count: 3,
          is_active: true,
          deadline: new Date('2025-12-10'),
        },
        {
          company: buildit!,
          category: management!,
          locationRef: onsite!,
          title: 'Safety Officer',
          description: 'Ensure construction site safety and compliance',
          requirements: 'Safety certification, compliance knowledge, field experience',
          location: 'Ho Chi Minh City',
          employment_type: 'full_time',
          experience_level: 'junior',
          salary_min: 20000000,
          salary_max: 28000000,
          salary_currency: 'VND',
          application_method: 'external',
          application_email: null,
          apply_count: 2,
          is_active: true,
          deadline: new Date('2025-11-15'),
        },
        {
          company: buildit!,
          category: engineering!,
          locationRef: hybrid!,
          title: 'Architect',
          description: 'Design infrastructure and building projects',
          requirements: 'Architecture degree, CAD software, creative design skills',
          location: 'Hanoi',
          employment_type: 'full_time',
          experience_level: 'senior',
          salary_min: 35000000,
          salary_max: 45000000,
          salary_currency: 'VND',
          application_method: 'external',
          application_email: null,
          apply_count: 1,
          is_active: true,
          deadline: new Date('2025-12-31'),
        },
        {
          company: buildit!,
          category: management!,
          locationRef: hybrid!,
          title: 'Project Coordinator',
          description: 'Coordinate construction projects and timelines',
          requirements: 'Project management, coordination skills, construction knowledge',
          location: 'Ho Chi Minh City',
          employment_type: 'part_time',
          experience_level: 'middle',
          salary_min: 25000000,
          salary_max: 32000000,
          salary_currency: 'VND',
          application_method: 'external',
          application_email: null,
          apply_count: 1,
          is_active: true,
          deadline: new Date('2025-11-30'),
        },
      ];

      for (const job of jobs) {
        await this.jobsRepository.save(this.jobsRepository.create(job));
      }
    }
  }
}
