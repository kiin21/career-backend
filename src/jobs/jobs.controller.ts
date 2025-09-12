import { Controller, Get, Param, Query, Req } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { ApiOkResponse, ApiParam, ApiTags } from '@nestjs/swagger';
import { Jobs } from './domain/jobs';
import {
  StandardPaginationResponse,
  StandardPaginationResponseDto,
} from '../utils/dto/standard-pagination-response.dto';
import { standardPagination } from '../utils/standard-pagination';
import { QueryJobsDto } from './dto/query-job.dto';
import { Request } from 'express';

@ApiTags('Jobs')
@Controller({
  path: 'jobs',
  version: '1',
})
export class JobsController {
  constructor(private readonly jobsService: JobsService) { }

  @Get()
  @ApiOkResponse({ type: StandardPaginationResponse(Jobs) })
  async findAll(
    @Query() query: QueryJobsDto,
    @Req() request: Request,
  ): Promise<StandardPaginationResponseDto<Jobs>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 12;
    if (limit > 50) {
      limit = 50;
    }

    const result = await this.jobsService.findManyWithPagination({
      filterOptions: query?.filters,
      sortOptions: query?.sort,
      paginationOptions: { page, limit },
    });

    // Build base URL
    const baseUrl = `${request.protocol}://${request.get('host')}${request.route.path}`;

    // Extract query params for pagination links
    const queryParams: any = {};
    if (query?.filters) {
      if (query.filters.location?.length) {
        queryParams.location = query.filters.location;
      }
      if (query.filters.salary) {
        if (query.filters.salary.min !== undefined) {
          queryParams.salary_min = query.filters.salary.min;
        }
        if (query.filters.salary.max !== undefined) {
          queryParams.salary_max = query.filters.salary.max;
        }
        if (query.filters.salary.currency) {
          queryParams.salary_currency = query.filters.salary.currency;
        }
      }
      if (query.filters.company?.id) {
        queryParams.company_id = query.filters.company.id;
      }
      if (query.filters.company?.name) {
        queryParams.company_name = query.filters.company.name;
      }
    }
    if (query?.sort?.length) {
      queryParams.sort = query.sort
        .map((s) => `${s.orderBy}:${s.order}`)
        .join(',');
    }

    return standardPagination(result.data, {
      page,
      limit,
      totalItems: result.totalItems,
      baseUrl,
      queryParams,
    });
  }

  @Get(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: Jobs,
  })
  findById(@Param('id') id: string) {
    return this.jobsService.findById(Number(id));
  }
}
