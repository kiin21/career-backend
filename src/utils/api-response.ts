// ===== ENHANCED RESPONSE TYPES =====

import { MetaDto } from './dto/base-response.dto';

export interface BaseResponse<T = any> {
  success: boolean;
  code: string;
  message?: string;
  data?: T;
  error?: T;
  meta: MetaDto;
}

export interface PaginationInfo {
  current_page: number;
  per_page: number;
  total_items: number;
  total_pages: number;
  has_next: boolean;
  has_previous: boolean;
  links: {
    self: string;
    first: string;
    next: string | null;
    last: string;
    previous: string | null;
  };
}

export interface PaginatedResponse<T = any> extends BaseResponse<T[]> {
  pagination: PaginationInfo;
  filters?: Record<string, any>;
}

// ===== ENHANCED RESPONSE BUILDER =====

export class ApiResponse {
  private static buildLinks(
    baseUrl: string,
    page: number,
    limit: number,
    totalPages: number,
    queryParams?: Record<string, any>,
  ): PaginationInfo['links'] {
    const buildUrl = (p: number) => {
      const params = new URLSearchParams({
        page: p.toString(),
        limit: limit.toString(),
        ...Object.fromEntries(
          Object.entries(queryParams || {}).filter(
            ([, value]) => value !== undefined && value !== null,
          ),
        ),
      });
      return `${baseUrl}?${params.toString()}`;
    };

    return {
      self: buildUrl(page),
      first: buildUrl(1),
      next: page < totalPages ? buildUrl(page + 1) : null,
      last: buildUrl(totalPages),
      previous: page > 1 ? buildUrl(page - 1) : null,
    };
  }

  static success<T>(
    data: T,
    message?: string,
    code: string = 'OK',
  ): BaseResponse<T> {
    return {
      success: true,
      code,
      message,
      data,
      meta: {
        timestamp: new Date().toISOString(),
      },
    };
  }

  static error(error: any, httpCode: string = 'ERROR'): BaseResponse {
    return {
      success: false,
      code: httpCode,
      error: error,
      meta: {
        timestamp: new Date().toISOString(),
      },
    };
  }

  static validationError(
    message: string,
    errorDetail: { field: string; code: string; message: string },
    httpCode: string = 'VALIDATION_ERROR',
  ): BaseResponse {
    return {
      success: false,
      code: httpCode,
      message,
      data: null,
      error: errorDetail,
      meta: {
        timestamp: new Date().toISOString(),
      },
    };
  }

  static paginated<T>(
    data: T[],
    pagination: {
      current_page: number;
      per_page: number;
      total_items: number;
    },
    baseUrl: string,
    message?: string,
    filters?: Record<string, any>,
    code: string = 'OK',
    queryParams?: Record<string, any>,
  ): PaginatedResponse<T> {
    const total_pages = Math.ceil(pagination.total_items / pagination.per_page);
    const has_next = pagination.current_page < total_pages;
    const has_previous = pagination.current_page > 1;

    const paginationInfo: PaginationInfo = {
      ...pagination,
      total_pages,
      has_next,
      has_previous,
      links: this.buildLinks(
        baseUrl,
        pagination.current_page,
        pagination.per_page,
        total_pages,
        queryParams,
      ),
    };

    return {
      success: true,
      code,
      message,
      data,
      pagination: paginationInfo,
      ...(filters && { filters }),
      meta: {
        timestamp: new Date().toISOString(),
      },
    };
  }
}
