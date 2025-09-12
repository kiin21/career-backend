import { Body, Controller, Get, Param, Post, Query, Req } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { ApiOkResponse, ApiParam, ApiTags, ApiBody } from '@nestjs/swagger';
import { Jobs } from './domain/jobs';
import { StandardPaginationResponseDto } from '../utils/dto/standard-pagination-response.dto';
import { PaginationQueryDto, SearchJobDto } from './dto/search-job.dto';
import { Request } from 'express';
import { ApiResponse, PaginatedResponse } from '../utils/api-response';

@ApiTags('Jobs')
@ApiOkResponse({ type: StandardPaginationResponseDto })
@Controller({ path: 'jobs', version: '1' })
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post()
  @ApiOkResponse({ type: StandardPaginationResponseDto })
  @ApiBody({ type: SearchJobDto })
  async findManyWithPagination(
    @Body() searchDto: SearchJobDto,
    @Query() paginationQuery: PaginationQueryDto,
    @Req() request: Request,
  ): Promise<PaginatedResponse<Jobs>> {
    const page = paginationQuery?.page ?? 1;
    let limit = paginationQuery?.limit ?? 12;
    if (limit > 50) {
      limit = 50;
    }

    const filterOptions: any = {};

    if (searchDto.location && searchDto.location.length > 0) {
      filterOptions.location = searchDto.location;
    }

    if (searchDto.salary) {
      filterOptions.salary = searchDto.salary;
    }

    if (searchDto.company) {
      filterOptions.company = searchDto.company;
    }

    if (searchDto.employment_type) {
      filterOptions.employment_type = searchDto.employment_type;
    }

    const result = await this.jobsService.findManyWithPagination({
      filterOptions: Object.keys(filterOptions).length > 0 ? filterOptions : null,
      sortOptions: searchDto.sort,
      paginationOptions: { page, limit },
      search: searchDto.search,
    });

    const baseUrl = `${request.protocol}://${request.get('host')}${request.route.path}`;

    const activeFilters: any = {};
    if (searchDto.location && searchDto.location.length > 0) {
      activeFilters.location = searchDto.location;
    }
    if (searchDto.salary) {
      const salaryFilter: any = {};
      if (searchDto.salary.min !== undefined) {
        salaryFilter.min = searchDto.salary.min;
      }
      if (searchDto.salary.max !== undefined) {
        salaryFilter.max = searchDto.salary.max;
      }
      if (Object.keys(salaryFilter).length > 0) {
        activeFilters.salary = salaryFilter;
      }
    }

    if (searchDto.company) {
      const companyFilter: any = {};
      if (searchDto.company.ids && searchDto.company.ids.length > 0) {
        companyFilter.ids = searchDto.company.ids;
      }
      if (Object.keys(companyFilter).length > 0) {
        activeFilters.company = companyFilter;
      }
    }

    return ApiResponse.paginated(
      result.data,
      {
        current_page: page,
        per_page: limit,
        total_items: result.totalItems,
      },
      baseUrl,
      'Jobs retrieved successfully',
      Object.keys(activeFilters).length > 0 ? activeFilters : undefined,
      'OK',
      { ...searchDto, ...paginationQuery },
    );
  }

  @Get(':id')
  @ApiParam({ name: 'id', type: String, required: true })
  @ApiOkResponse({ type: Jobs })
  async findById(@Param('id') id: string) {
    const job = await this.jobsService.findById(Number(id));

    if (!job) {
      return ApiResponse.error(null, 'JOB_NOT_FOUND');
    }

    return ApiResponse.success(job, 'Job retrieved successfully', 'OK');
  }
}
