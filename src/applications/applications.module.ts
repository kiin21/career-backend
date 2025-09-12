import {
  // do not remove this comment
  Module,
} from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { RelationalApplicationsPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [
    // do not remove this comment
    RelationalApplicationsPersistenceModule,
  ],
  providers: [ApplicationsService],
  exports: [ApplicationsService, RelationalApplicationsPersistenceModule],
})
export class ApplicationsModule {}
