import { Type } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export class PaginationLinksDto {
  @ApiProperty({
    type: String,
    example: '/api/v1/jobs?page=1&limit=12',
    description: 'Current page URL',
  })
  self: string;

  @ApiProperty({
    type: String,
    example: '/api/v1/jobs?page=1&limit=12',
    description: 'First page URL',
  })
  first: string;

  @ApiProperty({
    type: String,
    example: '/api/v1/jobs?page=2&limit=12',
    description: 'Next page URL',
    nullable: true,
  })
  next: string | null;

  @ApiProperty({
    type: String,
    example: '/api/v1/jobs?page=8&limit=12',
    description: 'Last page URL',
  })
  last: string;

  @ApiProperty({
    type: String,
    example: null,
    description: 'Previous page URL',
    nullable: true,
  })
  previous: string | null;
}

export class PaginationMetaDto {
  @ApiProperty({
    type: Number,
    example: 1,
    description: 'Current page number',
  })
  current_page: number;

  @ApiProperty({
    type: Number,
    example: 12,
    description: 'Items per page',
  })
  per_page: number;

  @ApiProperty({
    type: Number,
    example: 95,
    description: 'Total number of items',
  })
  total_items: number;

  @ApiProperty({
    type: Number,
    example: 8,
    description: 'Total number of pages',
  })
  total_pages: number;

  @ApiProperty({
    type: Boolean,
    example: true,
    description: 'Whether there is a next page',
  })
  has_next: boolean;

  @ApiProperty({
    type: Boolean,
    example: false,
    description: 'Whether there is a previous page',
  })
  has_previous: boolean;

  @ApiProperty({
    type: PaginationLinksDto,
    description: 'Pagination links',
  })
  links: PaginationLinksDto;
}

export class StandardPaginationResponseDto<T> {
  data: T[];
  pagination: PaginationMetaDto;
}

export function StandardPaginationResponse<T>(classReference: Type<T>) {
  abstract class Pagination {
    @ApiProperty({ type: [classReference] })
    data!: T[];

    @ApiProperty({
      type: PaginationMetaDto,
      description: 'Pagination metadata',
    })
    pagination: PaginationMetaDto;
  }

  Object.defineProperty(Pagination, 'name', {
    writable: false,
    value: `StandardPagination${classReference.name}ResponseDto`,
  });

  return Pagination;
}
