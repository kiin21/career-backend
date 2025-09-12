import {
  // do not remove this comment
  Module,
} from '@nestjs/common';
import { companiesService } from './companies.service';
import { RelationalcompaniesPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [
    // do not remove this comment
    RelationalcompaniesPersistenceModule,
  ],
  providers: [companiesService],
  exports: [companiesService, RelationalcompaniesPersistenceModule],
})
export class companiesModule {}
