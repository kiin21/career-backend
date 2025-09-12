import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
  Min,
} from 'class-validator';
import { Transform, Type, plainToInstance } from 'class-transformer';
import { Jobs } from '../domain/jobs';
import { RoleDto } from '../../roles/dto/role.dto';

export class SalaryFilterDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0)
  min?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0)
  max?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  currency?: string;
}

export class CompanyFilterDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  id?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string;
}

export class FilterJobsDto {
  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  location?: string[];

  @ApiPropertyOptional({ type: SalaryFilterDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => SalaryFilterDto)
  salary?: SalaryFilterDto;

  @ApiPropertyOptional({ type: CompanyFilterDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => CompanyFilterDto)
  company?: CompanyFilterDto;

  @ApiPropertyOptional({ type: RoleDto })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => RoleDto)
  roles?: RoleDto[] | null;
}

export class SortJobsDto {
  @ApiProperty()
  @Type(() => String)
  @IsString()
  orderBy: keyof Jobs;

  @ApiProperty()
  @IsString()
  order: string;
}

export class QueryJobsDto {
  @ApiPropertyOptional()
  @Transform(({ value }) => (value ? Number(value) : 1))
  @IsNumber()
  @IsOptional()
  page?: number;

  @ApiPropertyOptional()
  @Transform(({ value }) => (value ? Number(value) : 10))
  @IsNumber()
  @IsOptional()
  limit?: number;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @Transform(({ value }) =>
    value ? plainToInstance(FilterJobsDto, JSON.parse(value)) : undefined,
  )
  @ValidateNested()
  @Type(() => FilterJobsDto)
  filters?: FilterJobsDto | null;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @Transform(({ value }) => {
    return value ? plainToInstance(SortJobsDto, JSON.parse(value)) : undefined;
  })
  @ValidateNested({ each: true })
  @Type(() => SortJobsDto)
  sort?: SortJobsDto[] | null;
}
