import {
  // do not remove this comment
  Module,
} from '@nestjs/common';
import { JobsService } from './jobs.service';
import { JobsController } from './jobs.controller';
import { RelationalJobsPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [
    // do not remove this comment
    RelationalJobsPersistenceModule,
  ],
  controllers: [JobsController],
  providers: [JobsService],
  exports: [JobsService, RelationalJobsPersistenceModule],
})
export class JobsModule {}
