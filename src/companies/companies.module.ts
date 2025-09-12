import {
  // do not remove this comment
  Module,
} from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { RelationalcompaniesPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [
    // do not remove this comment
    RelationalcompaniesPersistenceModule,
  ],
  providers: [CompaniesService],
  exports: [CompaniesService, RelationalcompaniesPersistenceModule],
})
export class companiesModule {}
