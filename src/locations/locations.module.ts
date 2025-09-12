import {
  // do not remove this comment
  Module,
} from '@nestjs/common';
import { locationsService } from './locations.service';
import { RelationallocationsPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [
    // do not remove this comment
    RelationallocationsPersistenceModule,
  ],
  providers: [locationsService],
  exports: [locationsService, RelationallocationsPersistenceModule],
})
export class locationsModule {}
