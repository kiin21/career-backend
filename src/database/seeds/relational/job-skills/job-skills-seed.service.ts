import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JobSkillsEntity } from '../../../../job-skills/infrastructure/persistence/relational/entities/job-skills.entity';
import { JobsEntity } from '../../../../jobs/infrastructure/persistence/relational/entities/jobs.entity';

@Injectable()
export class JobSkillsSeedService {
  constructor(
    @InjectRepository(JobSkillsEntity)
    private jobSkillsRepository: Repository<JobSkillsEntity>,
    @InjectRepository(JobsEntity)
    private jobsRepository: Repository<JobsEntity>,
  ) {}

  async run() {
    const count = await this.jobSkillsRepository.count();

    if (!count) {
      // Get jobs by title to establish relationships
      const softwareEngineerJob = await this.jobsRepository.findOne({
        where: { title: 'Software Engineer' },
      });
      const aiResearchInternJob = await this.jobsRepository.findOne({
        where: { title: 'AI Research Intern' },
      });
      const frontendDeveloperJob = await this.jobsRepository.findOne({
        where: { title: 'Frontend Developer' },
      });
      const dataAnalystInternJob = await this.jobsRepository.findOne({
        where: { title: 'Data Analyst Intern' },
      });
      const civilEngineerJob = await this.jobsRepository.findOne({
        where: { title: 'Civil Engineer' },
      });

      const jobSkills = [
        // Software Engineer skills (job_id: 1)
        {
          job_id: softwareEngineerJob!.id,
          skill_name: 'Python',
          is_required: true,
        },
        {
          job_id: softwareEngineerJob!.id,
          skill_name: 'SQL',
          is_required: true,
        },
        {
          job_id: softwareEngineerJob!.id,
          skill_name: 'REST API',
          is_required: true,
        },
        {
          job_id: softwareEngineerJob!.id,
          skill_name: 'Git',
          is_required: false,
        },

        // AI Research Intern skills (job_id: 2)
        {
          job_id: aiResearchInternJob!.id,
          skill_name: 'Python',
          is_required: true,
        },
        {
          job_id: aiResearchInternJob!.id,
          skill_name: 'TensorFlow',
          is_required: false,
        },
        {
          job_id: aiResearchInternJob!.id,
          skill_name: 'Machine Learning',
          is_required: true,
        },

        // Frontend Developer skills (job_id: 7)
        {
          job_id: frontendDeveloperJob!.id,
          skill_name: 'React',
          is_required: true,
        },
        {
          job_id: frontendDeveloperJob!.id,
          skill_name: 'JavaScript',
          is_required: true,
        },
        {
          job_id: frontendDeveloperJob!.id,
          skill_name: 'CSS',
          is_required: true,
        },
        {
          job_id: frontendDeveloperJob!.id,
          skill_name: 'HTML',
          is_required: false,
        },

        // Data Analyst Intern skills (job_id: 8)
        {
          job_id: dataAnalystInternJob!.id,
          skill_name: 'SQL',
          is_required: true,
        },
        {
          job_id: dataAnalystInternJob!.id,
          skill_name: 'Excel',
          is_required: true,
        },
        {
          job_id: dataAnalystInternJob!.id,
          skill_name: 'Python',
          is_required: false,
        },

        // Civil Engineer skills (job_id: 12)
        {
          job_id: civilEngineerJob!.id,
          skill_name: 'AutoCAD',
          is_required: true,
        },
        {
          job_id: civilEngineerJob!.id,
          skill_name: 'Project Management',
          is_required: true,
        },
        {
          job_id: civilEngineerJob!.id,
          skill_name: 'Construction',
          is_required: false,
        },
      ];

      for (const jobSkill of jobSkills) {
        await this.jobSkillsRepository.save(
          this.jobSkillsRepository.create(jobSkill),
        );
      }
    }
  }
}
