import { ApiProperty } from '@nestjs/swagger';

export class Companies {
  @ApiProperty({
    type: String,
  })
  id: number | string;

  @ApiProperty({ type: String })
  name: string;
}
