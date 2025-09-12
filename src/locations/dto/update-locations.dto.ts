// Don't forget to use the class-validator decorators in the DTO properties.
// import { Allow } from 'class-validator';

import { PartialType } from '@nestjs/swagger';
import { CreatelocationsDto } from './create-locations.dto';

export class UpdatelocationsDto extends PartialType(CreatelocationsDto) {}
