import {
  // do not remove this comment
  Module,
} from '@nestjs/common';
import { IndustriesService } from './industries.service';
import { RelationalIndustriesPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [
    // do not remove this comment
    RelationalIndustriesPersistenceModule,
  ],
  providers: [IndustriesService],
  exports: [IndustriesService, RelationalIndustriesPersistenceModule],
})
export class IndustriesModule {}
