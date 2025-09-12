import {
  // do not remove this comment
  Module,
} from '@nestjs/common';
import { JobSkillsService } from './job-skills.service';
import { RelationalJobSkillsPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [
    // do not remove this comment
    RelationalJobSkillsPersistenceModule,
  ],
  providers: [JobSkillsService],
  exports: [JobSkillsService, RelationalJobSkillsPersistenceModule],
})
export class JobSkillsModule {}
