import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApplicationsEntity } from '../../../../applications/infrastructure/persistence/relational/entities/applications.entity';
import { JobsEntity } from '../../../../jobs/infrastructure/persistence/relational/entities/jobs.entity';
import { UserEntity } from '../../../../users/infrastructure/persistence/relational/entities/user.entity';

@Injectable()
export class ApplicationsSeedService {
  constructor(
    @InjectRepository(ApplicationsEntity)
    private applicationsRepository: Repository<ApplicationsEntity>,
    @InjectRepository(JobsEntity)
    private jobsRepository: Repository<JobsEntity>,
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}

  async run() {
    const count = await this.applicationsRepository.count();

    if (!count) {
      // Get users by email
      const alice = await this.usersRepository.findOne({
        where: { email: 'alice@example.com' },
      });
      const bao = await this.usersRepository.findOne({
        where: { email: 'bao@example.com' },
      });
      const carla = await this.usersRepository.findOne({
        where: { email: 'carla@example.com' },
      });

      // Get jobs by title
      const softwareEngineerJob = await this.jobsRepository.findOne({
        where: { title: 'Software Engineer' },
      });
      const aiResearchInternJob = await this.jobsRepository.findOne({
        where: { title: 'AI Research Intern' },
      });
      const financialAnalystJob = await this.jobsRepository.findOne({
        where: { title: 'Financial Analyst' },
      });
      const frontendDeveloperJob = await this.jobsRepository.findOne({
        where: { title: 'Frontend Developer' },
      });
      const dataAnalystInternJob = await this.jobsRepository.findOne({
        where: { title: 'Data Analyst Intern' },
      });
      const nursePractitionerJob = await this.jobsRepository.findOne({
        where: { title: 'Nurse Practitioner' },
      });
      const civilEngineerJob = await this.jobsRepository.findOne({
        where: { title: 'Civil Engineer' },
      });
      const architectJob = await this.jobsRepository.findOne({
        where: { title: 'Architect' },
      });
      const projectCoordinatorJob = await this.jobsRepository.findOne({
        where: { title: 'Project Coordinator' },
      });

      const applications = [
        {
          job: softwareEngineerJob!,
          job_id: softwareEngineerJob!.id,
          user: alice!,
          user_id: alice!.id,
          status: 'applied',
          resumeUrl: 'https://cv.com/alice.pdf',
          coverUrl: null,
          responses: JSON.stringify({
            experience: '3 years Python',
            motivation: 'Love backend development',
          }),
        },
        {
          job: softwareEngineerJob!,
          job_id: softwareEngineerJob!.id,
          user: bao!,
          user_id: bao!.id,
          status: 'reviewed',
          resumeUrl: 'https://cv.com/bao.pdf',
          coverUrl: 'https://cv.com/bao_cover.pdf',
          responses: JSON.stringify({
            experience: 'Built REST APIs',
            motivation: 'Excited about AI platform',
          }),
        },
        {
          job: aiResearchInternJob!,
          job_id: aiResearchInternJob!.id,
          user: alice!,
          user_id: alice!.id,
          status: 'interview',
          resumeUrl: 'https://cv.com/alice.pdf',
          coverUrl: null,
          responses: JSON.stringify({
            research_interest: 'Computer Vision',
            availability: 'Full-time internship',
          }),
        },
        {
          job: aiResearchInternJob!,
          job_id: aiResearchInternJob!.id,
          user: carla!,
          user_id: carla!.id,
          status: 'applied',
          resumeUrl: 'https://cv.com/carla.pdf',
          coverUrl: null,
          responses: JSON.stringify({
            research_interest: 'NLP',
            availability: 'Part-time internship',
          }),
        },
        {
          job: financialAnalystJob!,
          job_id: financialAnalystJob!.id,
          user: alice!,
          user_id: alice!.id,
          status: 'applied',
          resumeUrl: 'https://cv.com/alice.pdf',
          coverUrl: null,
          responses: JSON.stringify({
            finance_experience: 'Personal finance projects',
            skills: 'Excel, Financial modeling',
          }),
        },
        {
          job: financialAnalystJob!,
          job_id: financialAnalystJob!.id,
          user: bao!,
          user_id: bao!.id,
          status: 'rejected',
          resumeUrl: 'https://cv.com/bao.pdf',
          coverUrl: null,
          responses: JSON.stringify({
            finance_experience: 'Basic accounting',
            skills: 'Excel',
          }),
        },
        {
          job: frontendDeveloperJob!,
          job_id: frontendDeveloperJob!.id,
          user: carla!,
          user_id: carla!.id,
          status: 'applied',
          resumeUrl: 'https://cv.com/carla.pdf',
          coverUrl: 'https://cv.com/carla_cover.pdf',
          responses: JSON.stringify({
            frontend_experience: 'React projects',
            portfolio: 'github.com/carla',
          }),
        },
        {
          job: dataAnalystInternJob!,
          job_id: dataAnalystInternJob!.id,
          user: alice!,
          user_id: alice!.id,
          status: 'reviewed',
          resumeUrl: 'https://cv.com/alice.pdf',
          coverUrl: null,
          responses: JSON.stringify({
            sql_experience: 'University projects',
            tools: 'PostgreSQL, Excel',
          }),
        },
        {
          job: nursePractitionerJob!,
          job_id: nursePractitionerJob!.id,
          user: bao!,
          user_id: bao!.id,
          status: 'applied',
          resumeUrl: 'https://cv.com/bao.pdf',
          coverUrl: null,
          responses: JSON.stringify({
            healthcare_interest: 'Family healthcare background',
            availability: 'Immediate',
          }),
        },
        {
          job: civilEngineerJob!,
          job_id: civilEngineerJob!.id,
          user: bao!,
          user_id: bao!.id,
          status: 'applied',
          resumeUrl: 'https://cv.com/bao.pdf',
          coverUrl: null,
          responses: JSON.stringify({
            engineering_experience: 'Internship at construction firm',
            software: 'AutoCAD, SketchUp',
          }),
        },
        {
          job: architectJob!,
          job_id: architectJob!.id,
          user: alice!,
          user_id: alice!.id,
          status: 'applied',
          resumeUrl: 'https://cv.com/alice.pdf',
          coverUrl: null,
          responses: JSON.stringify({
            design_experience: 'Architecture student projects',
            creativity: 'High attention to design details',
          }),
        },
        {
          job: projectCoordinatorJob!,
          job_id: projectCoordinatorJob!.id,
          user: carla!,
          user_id: carla!.id,
          status: 'applied',
          resumeUrl: 'https://cv.com/carla.pdf',
          coverUrl: null,
          responses: JSON.stringify({
            coordination_experience: 'Event coordination',
            skills: 'Planning, Communication',
          }),
        },
      ];

      for (const application of applications) {
        await this.applicationsRepository.save(this.applicationsRepository.create(application));
      }
    }
  }
}
