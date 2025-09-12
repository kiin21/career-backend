import { ApiProperty } from '@nestjs/swagger';
import { PaginationInfoDto } from './base-response.dto';

export class StandardPaginationResponseDto<T> {
  @ApiProperty({ type: [Object] })
  data: T[];

  @ApiProperty({ type: PaginationInfoDto })
  pagination: PaginationInfoDto;
}
