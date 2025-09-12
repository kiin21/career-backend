import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DataSource, DataSourceOptions } from 'typeorm';
import { TypeOrmConfigService } from '../../typeorm-config.service';
import { RoleSeedModule } from './role/role-seed.module';
import { StatusSeedModule } from './status/status-seed.module';
import { UserSeedModule } from './user/user-seed.module';
import { IndustriesSeedModule } from './industries/industries-seed.module';
import { JobCategoriesSeedModule } from './job-categories/job-categories-seed.module';
import { LocationsSeedModule } from './locations/locations-seed.module';
import { CompaniesSeedModule } from './companies/companies-seed.module';
import { JobsSeedModule } from './jobs/jobs-seed.module';
import { JobSkillsSeedModule } from './job-skills/job-skills-seed.module';
import { ApplicationsSeedModule } from './applications/applications-seed.module';
import databaseConfig from '../../config/database.config';
import appConfig from '../../../config/app.config';

@Module({
  imports: [
    RoleSeedModule,
    StatusSeedModule,
    UserSeedModule,
    IndustriesSeedModule,
    JobCategoriesSeedModule,
    LocationsSeedModule,
    CompaniesSeedModule,
    JobsSeedModule,
    JobSkillsSeedModule,
    ApplicationsSeedModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, appConfig],
      envFilePath: ['.env'],
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
      dataSourceFactory: async (options: DataSourceOptions) => {
        return new DataSource(options).initialize();
      },
    }),
  ],
})
export class SeedModule {}
