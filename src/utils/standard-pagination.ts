import { IPaginationOptions } from './types/pagination-options';
import {
  StandardPaginationResponseDto,
  PaginationMetaDto,
  PaginationLinksDto,
} from './dto/standard-pagination-response.dto';

export interface StandardPaginationOptions extends IPaginationOptions {
  totalItems: number;
  baseUrl: string;
  queryParams?: Record<string, any>;
}

export const standardPagination = <T>(
  data: T[],
  options: StandardPaginationOptions,
): StandardPaginationResponseDto<T> => {
  const { page, limit, totalItems, baseUrl, queryParams = {} } = options;

  const totalPages = Math.ceil(totalItems / limit);
  const hasNext = page < totalPages;
  const hasPrevious = page > 1;

  // Build query string
  const buildUrl = (pageNum: number) => {
    const params = new URLSearchParams({
      page: pageNum.toString(),
      limit: limit.toString(),
      ...Object.fromEntries(
        Object.entries(queryParams).filter(
          ([_, value]) => value !== undefined && value !== null,
        ),
      ),
    });
    return `${baseUrl}?${params.toString()}`;
  };

  const links: PaginationLinksDto = {
    self: buildUrl(page),
    first: buildUrl(1),
    next: hasNext ? buildUrl(page + 1) : null,
    last: buildUrl(totalPages),
    previous: hasPrevious ? buildUrl(page - 1) : null,
  };

  const pagination: PaginationMetaDto = {
    current_page: page,
    per_page: limit,
    total_items: totalItems,
    total_pages: totalPages,
    has_next: hasNext,
    has_previous: hasPrevious,
    links,
  };

  return {
    data,
    pagination,
  };
};
