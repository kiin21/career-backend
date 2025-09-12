import {
  // do not remove this comment
  Module,
} from '@nestjs/common';
import { JobCategoriesService } from './job-categories.service';
import { RelationalJobCategoriesPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [
    // do not remove this comment
    RelationalJobCategoriesPersistenceModule,
  ],
  providers: [JobCategoriesService],
  exports: [JobCategoriesService, RelationalJobCategoriesPersistenceModule],
})
export class JobCategoriesModule {}
