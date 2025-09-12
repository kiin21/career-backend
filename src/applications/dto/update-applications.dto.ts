// Don't forget to use the class-validator decorators in the DTO properties.
// import { Allow } from 'class-validator';

import { PartialType } from '@nestjs/swagger';
import { CreateApplicationsDto } from './create-applications.dto';

export class UpdateApplicationsDto extends PartialType(CreateApplicationsDto) {}
