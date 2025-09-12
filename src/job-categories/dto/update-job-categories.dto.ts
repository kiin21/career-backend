// Don't forget to use the class-validator decorators in the DTO properties.
// import { Allow } from 'class-validator';

import { PartialType } from '@nestjs/swagger';
import { CreateJobCategoriesDto } from './create-job-categories.dto';

export class UpdateJobCategoriesDto extends PartialType(CreateJobCategoriesDto) {}
