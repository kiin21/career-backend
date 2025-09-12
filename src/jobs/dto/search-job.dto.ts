import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
  Min,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { Jobs } from '../domain/jobs';
import { createNumberTransformer } from '../../utils/transformers/number.transformer';

enum EmploymentType {
  FULL_TIME = 'full_time',
  PART_TIME = 'part_time',
}

export class PaginationQueryDto {
  @ApiPropertyOptional({
    description: 'Page number',
    example: 1,
    minimum: 1,
  })
  @Transform(createNumberTransformer('page', 1))
  @IsNumber()
  @IsOptional()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({
    description: 'Number of items per page',
    example: 20,
    minimum: 1,
    maximum: 50,
  })
  @Transform(createNumberTransformer('limit', 12, 50))
  @IsNumber()
  @IsOptional()
  @Min(1)
  limit?: number;
}

export class SalaryFilterDto {
  @ApiPropertyOptional({
    description: 'Minimum salary',
    example: 800000,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  min?: number;

  @ApiPropertyOptional({
    description: 'Maximum salary',
    example: 120000000,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  max?: number;

  @ApiPropertyOptional({
    description: 'Currency',
    example: 'VND',
  })
  @IsOptional()
  @IsString()
  currency?: string;
}

export class CompanyFilterDto {
  @ApiPropertyOptional({
    type: [Number],
    description: 'Company IDs to filter by',
    example: [1, 2, 3, 4, 5],
  })
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  @Type(() => Number)
  ids?: number[];
}

export class SortJobDto {
  @ApiProperty({
    description: 'Field to sort by',
    example: 'created_at',
  })
  @IsString()
  orderBy: keyof Jobs;

  @ApiProperty({
    description: 'Sort order',
    enum: ['ASC', 'DESC'],
    example: 'DESC',
  })
  @IsString()
  order: 'ASC' | 'DESC';
}

export class SearchJobDto {
  @ApiPropertyOptional({
    description: 'Search term',
    example: 'software engineer',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    type: [String],
    description: 'Filter by location names',
    example: ['Ho Chi Minh City', 'Hanoi'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  location?: string[];

  @ApiPropertyOptional({
    type: SalaryFilterDto,
    description: 'Salary filter',
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => SalaryFilterDto)
  salary?: SalaryFilterDto;

  @IsOptional()
  employment_type?: EmploymentType;

  @ApiPropertyOptional({
    type: CompanyFilterDto,
    description: 'Company filter',
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => CompanyFilterDto)
  company?: CompanyFilterDto;

  @ApiPropertyOptional({
    type: [SortJobDto],
    description: 'Sort options',
    example: [{ orderBy: 'created_at', order: 'DESC' }],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SortJobDto)
  sort?: SortJobDto[];
}
