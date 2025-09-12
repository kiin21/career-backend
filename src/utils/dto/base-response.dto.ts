import { ApiProperty } from '@nestjs/swagger';

export class ErrorDto {
  @ApiProperty()
  code: string;

  @ApiProperty()
  message: string;

  @ApiProperty({ required: false })
  details?: any;
}

export class MetaDto {
  @ApiProperty()
  timestamp: string;
}

export class BaseResponseDto<T = any> {
  @ApiProperty()
  success: boolean;

  @ApiProperty()
  code: string;

  @ApiProperty({ required: false })
  message?: string;

  @ApiProperty({ required: false })
  data?: T;

  @ApiProperty({ type: ErrorDto, required: false })
  error?: ErrorDto;

  @ApiProperty({ type: MetaDto })
  meta: MetaDto;
}

export class PaginationLinksDto {
  @ApiProperty()
  self: string;

  @ApiProperty()
  first: string;

  @ApiProperty({ nullable: true })
  next: string | null;

  @ApiProperty()
  last: string;

  @ApiProperty({ nullable: true })
  previous: string | null;
}

export class PaginationInfoDto {
  @ApiProperty()
  current_page: number;

  @ApiProperty()
  per_page: number;

  @ApiProperty()
  total_items: number;

  @ApiProperty()
  total_pages: number;

  @ApiProperty()
  has_next: boolean;

  @ApiProperty()
  has_previous: boolean;

  @ApiProperty({ type: PaginationLinksDto })
  links: PaginationLinksDto;
}

export class PaginatedResponseDto<T = any> extends BaseResponseDto<T[]> {
  @ApiProperty({ type: PaginationInfoDto })
  pagination: PaginationInfoDto;

  @ApiProperty({ required: false })
  filters?: Record<string, any>;
}
