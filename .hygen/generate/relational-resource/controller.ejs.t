---
to: src/<%= h.inflection.transform(name, ['pluralize', 'underscore', 'dasherize']) %>/<%= h.inflection.transform(name, ['pluralize', 'underscore', 'dasherize']) %>.controller.ts
---
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  Req,
} from '@nestjs/common';
import { <%= h.inflection.transform(name, ['pluralize']) %>Service } from './<%= h.inflection.transform(name, ['pluralize', 'underscore', 'dasherize']) %>.service';
import { Create<%= name %>Dto } from './dto/create-<%= h.inflection.transform(name, ['underscore', 'dasherize']) %>.dto';
import { Update<%= name %>Dto } from './dto/update-<%= h.inflection.transform(name, ['underscore', 'dasherize']) %>.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { <%= name %> } from './domain/<%= h.inflection.transform(name, ['underscore', 'dasherize']) %>';
import { AuthGuard } from '@nestjs/passport';
import { StandardPaginationResponseDto } from '../utils/dto/standard-pagination-response.dto';
import { FindAll<%= h.inflection.transform(name, ['pluralize']) %>Dto } from './dto/find-all-<%= h.inflection.transform(name, ['pluralize', 'underscore', 'dasherize']) %>.dto';
import { Request } from 'express';
import { ApiResponse, PaginatedResponse } from '../utils/api-response';

@ApiTags('<%= h.inflection.transform(name, ['pluralize', 'humanize']) %>')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller({
  path: '<%= h.inflection.transform(name, ['pluralize', 'underscore', 'dasherize']) %>',
  version: '1',
})
export class <%= h.inflection.transform(name, ['pluralize']) %>Controller {
  constructor(private readonly <%= h.inflection.camelize(h.inflection.pluralize(name), true) %>Service: <%= h.inflection.transform(name, ['pluralize']) %>Service) {}

  @Post()
  @ApiCreatedResponse({
    type: <%= name %>,
  })
  async create(@Body() create<%= name %>Dto: Create<%= name %>Dto) {
    const result = await this.<%= h.inflection.camelize(h.inflection.pluralize(name), true) %>Service.create(create<%= name %>Dto);
    return ApiResponse.success(result, '<%= h.inflection.humanize(name) %> created successfully');
  }

  @Get()
  @ApiOkResponse({
    type: StandardPaginationResponseDto,
  })
  async findAll(
    @Query() query: FindAll<%= h.inflection.transform(name, ['pluralize']) %>Dto,
    @Req() request: Request,
  ): Promise<PaginatedResponse<<%= name %>>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    const result = await this.<%= h.inflection.camelize(h.inflection.pluralize(name), true) %>Service.findManyWithPagination({
      paginationOptions: { page, limit },
    });

    // Build base URL for pagination links
    const baseUrl = `${request.protocol}://${request.get('host')}${request.route.path}`;

    return ApiResponse.paginated(
      result.data,
      {
        current_page: page,
        per_page: limit,
        total_items: result.totalItems,
      },
      baseUrl,
      '<%= h.inflection.transform(name, ['pluralize', 'humanize']) %> retrieved successfully',
    );
  }

  @Get(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: <%= name %>,
  })
  async findById(@Param('id') id: string) {
    const result = await this.<%= h.inflection.camelize(h.inflection.pluralize(name), true) %>Service.findById(id);
    
    if (!result) {
      return ApiResponse.error(
        '<%= h.inflection.transform(name, ['underscore', 'upcase']) %>_NOT_FOUND',
        '<%= h.inflection.humanize(name) %> not found',
        { id },
        'NOT_FOUND',
      );
    }

    return ApiResponse.success(result, '<%= h.inflection.humanize(name) %> retrieved successfully');
  }

  @Patch(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: <%= name %>,
  })
  async update(
    @Param('id') id: string,
    @Body() update<%= name %>Dto: Update<%= name %>Dto,
  ) {
    const result = await this.<%= h.inflection.camelize(h.inflection.pluralize(name), true) %>Service.update(id, update<%= name %>Dto);
    return ApiResponse.success(result, '<%= h.inflection.humanize(name) %> updated successfully');
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  async remove(@Param('id') id: string) {
    await this.<%= h.inflection.camelize(h.inflection.pluralize(name), true) %>Service.remove(id);
    return ApiResponse.success(null, '<%= h.inflection.humanize(name) %> deleted successfully');
  }
}
