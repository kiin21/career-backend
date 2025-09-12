// Don't forget to use the class-validator decorators in the DTO properties.
// import { Allow } from 'class-validator';

import { PartialType } from '@nestjs/swagger';
import { CreatecompaniesDto } from './create-companies.dto';

export class UpdatecompaniesDto extends PartialType(CreatecompaniesDto) {}
