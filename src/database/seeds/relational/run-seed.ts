import { NestFactory } from '@nestjs/core';
import { RoleSeedService } from './role/role-seed.service';
import { SeedModule } from './seed.module';
import { StatusSeedService } from './status/status-seed.service';
import { UserSeedService } from './user/user-seed.service';
import { IndustriesSeedService } from './industries/industries-seed.service';
import { JobCategoriesSeedService } from './job-categories/job-categories-seed.service';
import { LocationsSeedService } from './locations/locations-seed.service';
import { CompaniesSeedService } from './companies/companies-seed.service';
import { JobsSeedService } from './jobs/jobs-seed.service';
import { JobSkillsSeedService } from './job-skills/job-skills-seed.service';
import { ApplicationsSeedService } from './applications/applications-seed.service';

const runSeed = async () => {
  const app = await NestFactory.create(SeedModule);

  // run seeds in dependency order
  await app.get(RoleSeedService).run();
  await app.get(StatusSeedService).run();
  await app.get(IndustriesSeedService).run();
  await app.get(JobCategoriesSeedService).run();
  await app.get(LocationsSeedService).run();
  await app.get(UserSeedService).run();
  await app.get(CompaniesSeedService).run();
  await app.get(JobsSeedService).run();
  await app.get(JobSkillsSeedService).run();
  await app.get(ApplicationsSeedService).run();

  await app.close();
};

void runSeed();
